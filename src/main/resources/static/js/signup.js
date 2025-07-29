document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('passwordv2');

    form.addEventListener('submit', function (e) {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            alert("❌ Enter valid email address.");
            return;
        }


        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            e.preventDefault();
            alert("❌ Password must contain at least 8 characters, one uppercase letter and one number.");
            return;
        }


        if (password !== confirmPassword) {
            e.preventDefault();
            alert("❌ Passwords do not match. Please try again.");

        }


    });
});
