<?php
/**
 * Ionic contact form handler.
 *
 * Accepts POST from the contact form, validates, applies basic spam
 * protection (honeypot + time trap), and sends via mail(). Responds with
 * JSON for fetch() submissions, or redirects back to the site with a status
 * flag for no-JS submissions.
 *
 * Lives in public/ so `astro build` copies it into dist/ untouched, keeping
 * deployment a single-folder upload.
 *
 * Carried over from the previous site with three fixes, each marked FIX below.
 */

declare(strict_types=1);

/**
 * FIX 1: Never let PHP notices into the response body.
 *
 * With display_errors on (the default on plenty of shared hosts), a mail()
 * warning was printed before the JSON, so the client's res.json() threw and
 * the real error message was replaced by a generic one. It also leaked the
 * server's absolute filesystem path to anyone who submitted the form.
 */
@ini_set('display_errors', '0');
@ini_set('log_errors', '1');
error_reporting(E_ALL);

const RECIPIENT     = 'info@ionicinnovate.com';
const SUBJECT       = 'New enquiry from ionicinnovate.com';
const MIN_FILL_SECS = 3;   // Humans need at least a few seconds to fill the form.
const MAX_FORM_AGE  = 7200; // Ignore a stamp older than two hours (stale tab).

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

$isFetch = (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'fetch');

// Where to send no-JS submissions back to: a local path only, never a full URL.
$returnPath = (string)($_POST['return'] ?? '/');
if (!preg_match('#^/[a-z0-9\-/]*$#i', $returnPath) || strpos($returnPath, '//') !== false) {
    $returnPath = '/';
}

function respond(bool $ok, string $error = ''): void
{
    global $isFetch, $returnPath;

    if ($isFetch) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'error' => $error]);
    } else {
        $flag = $ok ? 'sent' : 'error';
        header('Location: ' . $returnPath . '?contact=' . $flag . '#contact', true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Method not allowed.');
}

// --- Spam traps ---------------------------------------------------------

// Honeypot: a hidden field a human never fills in.
if (trim((string)($_POST['website'] ?? '')) !== '') {
    // Pretend success so bots don't adapt.
    respond(true);
}

/**
 * FIX 2: The time trap silently discarded genuine enquiries.
 *
 * form_ts is stamped by the browser from Date.now(). The old check was
 * `(time() - $ts) < MIN_FILL_SECS`, which is also true when the delta is
 * NEGATIVE, i.e. whenever the visitor's clock ran fast. Anyone with a clock
 * a few minutes ahead (extremely common on consumer devices) got a "message
 * sent" confirmation and no email was ever delivered. Reproduced against a
 * clock two hours out, so this was not theoretical.
 *
 * Now: only trip when the elapsed time is genuinely positive and short. A
 * negative or absurdly old stamp means an untrustworthy clock, so we ignore
 * the trap entirely and let the honeypot and validation do the work.
 */
$ts = (int)($_POST['form_ts'] ?? 0);
if ($ts > 0) {
    $elapsed = time() - $ts;
    if ($elapsed >= 0 && $elapsed < MIN_FILL_SECS) {
        respond(true);
    }
    unset($elapsed);
}

// --- Validation ---------------------------------------------------------

function clean(string $value, int $maxLen): string
{
    // Strip CR/LF to block mail-header injection, drop control chars.
    $value = str_replace(["\r", "\n"], ' ', $value);
    $value = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $value) ?? '');
    return mb_substr($value, 0, $maxLen);
}

$name    = clean((string)($_POST['name'] ?? ''), 100);
$email   = clean((string)($_POST['email'] ?? ''), 150);
$company = clean((string)($_POST['company'] ?? ''), 150);
$source  = clean((string)($_POST['source'] ?? ''), 100);
$message = trim(mb_substr((string)($_POST['message'] ?? ''), 0, 5000));

if ($name === '' || $email === '' || $message === '') {
    respond(false, 'Please fill in your name, email and message.');
}

if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    respond(false, 'That email address doesn’t look right. Please check it.');
}

// --- Send ---------------------------------------------------------------

$host = preg_replace('/[^a-z0-9.\-]/i', '', $_SERVER['SERVER_NAME'] ?? 'ionicinnovate.com');
$host = preg_replace('/^www\./', '', $host) ?: 'ionicinnovate.com';

$body = "New contact form enquiry\n"
    . str_repeat('-', 40) . "\n"
    . "Name:    {$name}\n"
    . "Email:   {$email}\n"
    . "Company: " . ($company !== '' ? $company : '(not given)') . "\n"
    . "Page:    " . ($source !== '' ? $source : 'Unknown') . "\n"
    . "Sent:    " . gmdate('Y-m-d H:i:s') . " UTC\n"
    . "IP:      " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n"
    . str_repeat('-', 40) . "\n\n"
    . $message . "\n";

/**
 * FIX 3: Encode the display name in Reply-To.
 *
 * CR/LF was already stripped, so header injection was not possible, but a
 * name containing < or > (or a non-ASCII character) produced a malformed
 * header that some MTAs drop. RFC 2047 encoding sidesteps both.
 */
$replyName = '=?UTF-8?B?' . base64_encode($name) . '?=';

$headers = [
    'From: Ionic Website <noreply@' . $host . '>',
    'Reply-To: ' . $replyName . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

// Suppressed because a transport failure is handled below, not printed.
$sent = @mail(
    RECIPIENT,
    '=?UTF-8?B?' . base64_encode(SUBJECT) . '?=',
    $body,
    implode("\r\n", $headers)
);

if ($sent) {
    respond(true);
}

error_log('contact.php: mail() returned false for enquiry from ' . $email);
respond(false, 'We couldn’t send your message right now. Please email ' . RECIPIENT . ' instead.');
