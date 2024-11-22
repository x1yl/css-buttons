document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", function () {
    const buttonId = this.id;
    fetch("button.css")
      .then((response) => response.text())
      .then((cssContent) => {
        const regex = new RegExp(`#${buttonId}(\\s|:)[^}]*}`, "g");
        const match = cssContent.match(regex);
        let buttonCss = "";
        if (match) {
          buttonCss = match.join("\n\n");

          if (buttonCss.includes("animation:")) {
            const animationRegex = /animation:\s*([\w-]+)/g;
            let foundAnimations = [];
            let currentMatch;

            while ((currentMatch = animationRegex.exec(buttonCss)) !== null) {
              foundAnimations.push(currentMatch[1]);
            }

            let allKeyframes = "";
            foundAnimations.forEach((animName) => {
              const keyframesRegex = new RegExp(
                `@keyframes\\s+${animName}[^#@]*}`,
                "g"
              );
              const keyframesMatch = cssContent.match(keyframesRegex);

              if (keyframesMatch) {
                allKeyframes += keyframesMatch[0] + "\n\n";
              }
            });

            if (allKeyframes) {
              buttonCss = allKeyframes + buttonCss;
            }
          }

          navigator.clipboard
            .writeText(buttonCss)
            .then(function () {
              alert("CSS copied to clipboard!");
            })
            .catch(function (err) {
              console.error("Could not copy text: ", err);
            });
        } else {
          alert("No CSS found for the button with ID: " + buttonId);
        }
      })
      .catch((error) => console.error("Error fetching CSS:", error));
  });
});
