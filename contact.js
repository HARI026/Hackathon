// Initialize EmailJS
(function () {
  emailjs.init("9pqB7hySi5e0x4L9Y"); // 🔁 Replace with your EmailJS Public Key
})();

// Form submission handler
document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const statusDiv = document.getElementById("message-status");
  statusDiv.innerHTML = "Sending...";

  emailjs.sendForm("service_3ir6p6g", "template_xd73cjw", this)
    .then(function () {
      statusDiv.innerHTML = `<span style="color:green;">Message sent successfully! ✅</span>`;
      document.getElementById("contact-form").reset();
    }, function (error) {
      statusDiv.innerHTML = `<span style="color:red;">Oops! Something went wrong. ❌</span>`;
      console.error("FAILED...", error);
    });
});
