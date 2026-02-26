const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

const form = document.getElementById('bookingForm');
const msg = document.getElementById('formMsg');

if (form) {
    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();

        const formData = {
            name: form.name.value.trim(),
            phone: form.phone.value.trim(),
            email: form.email.value.trim(),
            service: form.service.value,
            date: form.date.value,
            time: form.time.value || "Not specified",
            notes: form.notes.value || "No additional details",
            timestamp: new Date().toLocaleString()
        };

        if (!formData.name || !formData.phone || !formData.email || !formData.service || !formData.date) {
            msg.style.color = "crimson";
            msg.textContent = "Please fill all required fields.";
            return;
        }

        msg.style.color = "green";
        msg.textContent = "Sending inquiry...";

        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            msg.textContent = "Inquiry sent successfully! We'll contact you soon.";
            form.reset();

            setTimeout(() => {
                msg.textContent = "";
            }, 5000);

        } catch (error) {
            msg.style.color = "crimson";
            msg.textContent = "Failed to send inquiry. Please try again.";
            console.error('Error:', error);
        }
    });
}
