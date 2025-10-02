document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#popup form");
  const popup = document.getElementById("popup");

  const selects = document.querySelectorAll("select[data-relacion]");

  selects.forEach((select) => {
    const relacion = select.dataset.relacion;
    const radios = document.querySelectorAll(`input[name="${relacion}"]`);
    const container = select.closest(".severidad");

    // Ocultar al inicio
    container.classList.remove("visible");
    select.required = false;

    radios.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (this.value === "Falla") {
          container.classList.add("visible");
          select.required = true;
        } else {
          container.classList.remove("visible");
          select.required = false;
          select.value = ""; // limpiar selección
        }
      });
    });
  });

  // Envío del formulario (AJAX + confirmación)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const params = new URLSearchParams(formData);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: params,
      });

      const result = await response.json();

      let msg = document.getElementById("form-msg");
      if (!msg) {
        msg = document.createElement("p");
        msg.id = "form-msg";
        msg.style.color = "green";
        msg.style.textAlign = "center";
        popup.appendChild(msg);
      }

      if (result.status === "success") {
        msg.textContent = "✅ Respuesta guardada con éxito";
        form.reset();

        // Reiniciar selects
        selects.forEach((select) => {
          const container = select.closest(".severidad");
          container.classList.remove("visible");
          select.required = false;
          select.value = "";
        });
      } else {
        msg.textContent = "⚠️ Ocurrió un problema al guardar";
        msg.style.color = "red";
      }
    } catch (error) {
      let msg = document.getElementById("form-msg");
      if (!msg) {
        msg = document.createElement("p");
        msg.id = "form-msg";
        msg.style.textAlign = "center";
        form.insertAdjacentElement("afterend", msg);
      }
      msg.textContent = "❌ Error de conexión con el servidor";
      msg.style.color = "red";
      console.error(error);
    }
  });
});
