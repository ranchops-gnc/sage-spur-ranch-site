const messages = {
  idle: "Join the Founding Community interest list.",
  invalid: "Enter a valid email address.",
  loading: "Joining the interest list…",
  success: "Check your inbox to confirm your interest.",
  failure: "We could not submit the form. Please try again or use the standard form.",
};

export function isMailerLiteReady(action) {
  if (!action) {
    return false;
  }

  try {
    const url = new URL(action);
    return (
      url.protocol === "https:" &&
      (url.hostname === "mailerlite.com" ||
        url.hostname.endsWith(".mailerlite.com") ||
        url.hostname === "mlsend.com" ||
        url.hostname.endsWith(".mlsend.com"))
    );
  } catch {
    return false;
  }
}

export function getNewsletterState(status) {
  const safeStatus = Object.hasOwn(messages, status) ? status : "idle";
  const publicStatus =
    safeStatus === "invalid" || safeStatus === "failure" ? "error" : safeStatus;
  return { status: publicStatus, message: messages[safeStatus] };
}
