// Initialize CreateJS Stage
const canvas = document.getElementById("Canvas");
const stage = new createjs.Stage(canvas);

// Create the wheelContainer
const wheelContainer = new createjs.Container();
wheelContainer.regX = -250;
wheelContainer.regY = -250;
wheelContainer.x = 730;
wheelContainer.y = 350;
stage.addChild(wheelContainer);

// Create the wheel
var wheel = new createjs.Bitmap("src/WheelImg.png");
wheel.shadow = new createjs.Shadow("#000000", 5, 15, 50);
wheel.x = -480;
wheel.y = -650;
wheel.rotation = 15;
wheel.scaleX = 1.3;
wheel.scaleY = 1.3;
wheelContainer.addChild(wheel);

function generateRandomPrices() {
  const prices = [1, 150, 500, 350, 20, "+1 Spin", 800, 300, 5, 250, 1000, 200];
  return prices;
}

// Define the wheelContainer properties
const numSections = 12;
const sectionPrices = generateRandomPrices(numSections);
const sectionAngle = 360 / numSections;

// Add text for price
for (let i = 0; i < numSections; i++) {
  const priceText = new createjs.Text(
    sectionPrices[i].toString(),
    "30px Comic Sans MS",
    "white"
  );

  priceText.shadow = new createjs.Shadow("#000000", 3, 3, 5);
  priceText.regX = priceText.getMeasuredWidth() / 2;
  priceText.x = -250;
  priceText.y = -250;
  priceText.regY = 260;
  priceText.rotation = (i + 0.5) * sectionAngle;
  wheelContainer.addChild(priceText);
}

// Create the winning glow
const glow = new createjs.Bitmap("src/Glow.png")
glow.scaleX = .36;
glow.scaleY = .36;
glow.x = 407;
glow.y = 23;
glow.alpha = 0;
stage.addChild(glow)

// Create the spin button
const spinButton = new createjs.Bitmap("src/SpinButton.png");
spinButton.x = 660;
spinButton.y = 270;
spinButton.scaleX = 0.27;
spinButton.scaleY = 0.27;
spinButton.cursor = "pointer";
stage.addChild(spinButton);



let previousPosition = 0;

function wheelSpin() {

  spinButton.mouseEnabled = false;

  // Randomly select a section
  const randomIndex = Math.floor(Math.random() * numSections);
  var targetRotation = 360 * 5 - (randomIndex * sectionAngle + sectionAngle / 2);

  // Animate the wheel rotation
  TweenMax.to(wheelContainer, {
    rotation: targetRotation + previousPosition,
    duration: 5,
    ease: "power1.inOut",
    onComplete: () => {
      TweenMax.to(glow, .5, {
        alpha: 1,
        onComplete: () => {
          TweenMax.to(glow, .5, {
            alpha: 0,
            onComplete: () => {
              TweenMax.to(glow, .3, {
                alpha: 1,
                onComplete: () => {
                  TweenMax.to(glow, .3, {
                    alpha: 0,
                    onComplete: () => {
                      const selectedPrice = sectionPrices[randomIndex];
                      if (selectedPrice === "+1 Spin") {
                        alert(`Congratulations! You won ${selectedPrice}!`);
                        spinButton.mouseEnabled = true;
                        previousPosition = wheelContainer.rotation;
                      } else {
                        alert(`Congratulations! You won $${selectedPrice}!`);
                      }
                    }
                  });
                }
              });
            }
          });
        }
      });
    },
  });
}

// Add click event listener to the spin button
spinButton.addEventListener("click", () => {
  this.wheelSpin();
});

// Render the stage
stage.update();
createjs.Ticker.framerate = 60;
createjs.Ticker.addEventListener("tick", stage);
