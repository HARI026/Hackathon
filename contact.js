// Initialize EmailJS
(function () {
  emailjs.init("9pqB7hySi5e0x4L9Y"); // Replace with your actual EmailJS Public Key
})();

// Form submission handler
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const statusDiv = document.getElementById("message-status");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // 🟡 Get values from the form
    const name = form.querySelector('input[name="from_name"]').value;
    const email = form.querySelector('input[name="from_email"]').value;

    console.log("Sender Name:", name);
    console.log("Sender Email:", email);

    statusDiv.innerHTML = "Sending... ⏳";

    emailjs.sendForm("service_3ir6p6g", "template_xd73cjw", this)
      .then(() => {
        statusDiv.innerHTML = `<span style="color:green;">Message sent successfully! ✅</span>`;
        alert(`Thanks, ${name}! We received your message from ${email}.`);
        form.reset();
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
        statusDiv.innerHTML = `<span style="color:red;">Oops! Something went wrong. ❌</span>`;
      });
  });
});
