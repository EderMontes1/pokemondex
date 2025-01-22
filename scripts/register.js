
    document.querySelector(".form").addEventListener("submit", async (event) => {
        event.preventDefault(); // Previene que la página se recargue al enviar el formulario

        // Capturamos los datos del formulario
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmpassword").value;

        // Validamos que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        // Enviar los datos al backend
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Usuario registrado con éxito");
            } else {
                alert(result.message || "Error al registrar el usuario");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Hubo un error al registrar el usuario.");
        }
    });

