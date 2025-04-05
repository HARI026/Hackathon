// Replace with your actual EmailJS credentials
const SERVICE_ID = "service_3ir6p6g";
const TEMPLATE_ID = "template_xd73cjw";
const PUBLIC_KEY = "9pqB7hySi5e0x4L9Y";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("message-status");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this)
      .then(() => {
        status.innerHTML = "<p style='color: #00cc66;'>✅ Message sent successfully!</p>";
        form.reset();
      }, (err) => {
        status.innerHTML = "<p style='color: red;'>❌ Failed to send message. Please try again.</p>";
        console.error("Send error:", err);
      });
  });
});
