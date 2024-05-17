
const form = document.getElementById('form');
const imageContainer = document.getElementById('image-container');
const version = 2;
const alpha = 0.5;

async function run( img ) {
  console.log('Running');
  // Load the model.
  const model = await mobilenet.load({version, alpha});

  // Classify the image.
  const predictions = await model.classify(img);
  console.log('Predictions');
  console.log(predictions);

  // Get the logits.
  const logits = model.infer(img);
  console.log('Logits');
  logits.print(true);

  // Get the embedding.
  const embedding = model.infer(img, true);
  console.log('Embedding');
  embedding.print(true);

  // Show predictions.
  showResults(predictions);

};

const showImage = (image) => {
  imageContainer.innerHTML = '';
  const imgElement = document.createElement('img');
  imgElement.src = URL.createObjectURL(image);
  imgElement.width = 227;
  imgElement.height = 227;
  imageContainer.appendChild(imgElement);

  return imgElement;
};

const showResults = (predictions) => {
  const predictionList = document.createElement('ul');
  predictions.forEach(prediction => {
    const li = document.createElement('li');
    li.innerText = `${prediction.className}: ${prediction.probability.toFixed(3)}`;
    predictionList.appendChild(li);
  });
  imageContainer.appendChild(predictionList);
};

form.addEventListener('submit',  async function(e) {
  console.log('Form submitted');
  e.preventDefault();
  const data = new FormData(form);
  const img = data.get('image');
  console.log('Image', img);
  const imgResutl =  showImage(img);

  run(imgResutl);

});
