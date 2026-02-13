document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        submitBtn.classList.add("loading");
        submitBtn.textContent = "Sending...";
        status.textContent = "";
        status.className = "form-status";

        emailjs.sendForm(
            "service_ey6jkd4",
            "template_c2imz39",
            this
        ).then(
            function () {
                submitBtn.classList.remove("loading");
                submitBtn.textContent = "Send Message";

                status.textContent = "Message sent successfully 🚀";
                status.classList.add("success");

                form.reset();
            },
            function (error) {
                submitBtn.classList.remove("loading");
                submitBtn.textContent = "Send Message";

                status.textContent = "Failed to send message. Try again.";
                status.classList.add("error");

                console.error("EmailJS Error:", error);
            }
        );
    });
});
