import Cropper, { CropperViewer } from 'cropperjs';
const cropper = new Cropper('#image');
const canvas = cropper.getCropperCanvas();
const cropperImage = cropper.getCropperImage();
const selection = cropper.getCropperSelection();
const imageRect = cropperImage?.getBoundingClientRect();

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TransformMatrix {
  matrix: [number, number, number, number, number, number];
}

let imgNaturalWidth: number;
let imgNaturalHeight: number;
// let imageTransform: number[];
let isUserZoom = false;
let initialTransform;
let isTransformed = false;

cropperImage?.$ready((image) => {
  imgNaturalWidth = image.naturalWidth;
  imgNaturalHeight = image.naturalHeight;
  console.log(`
    Image natural width: ${imgNaturalWidth},
    Image natural height: ${imgNaturalHeight}
    `);
  // cropperImage.setAttribute('scalable', 'false');
  // imageTransform = cropperImage?.$getTransform();
  // console.log("Image transform: ", imageTransform);
});

document.querySelectorAll('button[data-ratio]').forEach(button => {
  button.addEventListener('click', () => {
      const ratio = parseFloat(button.getAttribute('data-ratio')!);
      const selection = cropper.getCropperSelection();
      selection?.setAttribute('aspect-ratio', ratio.toString());
  });
});

canvas?.addEventListener('action', (event) => {
  const customEvent = event as CustomEvent;
  if (customEvent.detail.action === 'scale') {
    isUserZoom = true;
  }
});

cropperImage?.addEventListener('transform', (event) => {
  if (isUserZoom) {
    // event.preventDefault();
    isUserZoom = false;
  }
});

document.getElementById('crop')?.addEventListener('click', async () => {
  if (selection && cropperImage && imageRect && canvas) {
    const transform = cropperImage.$getTransform();
    console.log("Image transform: ", transform);
    // Extract the scale values from the matrix
    const scaleX = transform[0]; // Horizontal scale
    const scaleY = transform[3]; // Vertical scale
    // const scaleX = Math.sqrt(transform[0] ** 2 + transform[1] ** 2); // Horizontal scale
    // const scaleY = Math.sqrt(transform[2] ** 2 + transform[3] ** 2); // Vertical scale

    const imgX = (canvas?.getBoundingClientRect().width - (imgNaturalWidth * transform[0])) / 2;
    const imgY = (canvas?.getBoundingClientRect().height - (imgNaturalHeight * transform[3])) / 2;

    const translateX = imgNaturalWidth * transform[0] - imageRect.width / 2;
    const translateY = imgNaturalHeight * transform[3] - imageRect.height / 2;

    console.log(`
      canvas width: ${canvas?.getBoundingClientRect().width},
      canvas height: ${canvas?.getBoundingClientRect().height}`);
      

    console.log(`
      canvas width: ${canvas?.getBoundingClientRect().width},
      canvas height: ${canvas?.getBoundingClientRect().height}`);
    
    console.log(`
      selection x: ${selection.x}, 
      selection y: ${selection.y}, 
      selection width: ${selection.width}, 
      selection height: ${selection.height}`);

    console.log(`
      transform[0] / Scale X (horizontal scaling): ${transform[0]}
      transform[1] / Skew Y (vertical skew): ${transform[1]}
      transform[2] / Skew X (horizontal skew): ${transform[2]}
      transform[3] / Scale Y (vertical scaling): ${transform[3]} 
      transform[4] / Translate X (horizontal translation): ${transform[4]}
      transform[5] / Translate Y: ${transform[5]}
    `);


    console.log(`
      Calculated image x: ${imgX},
      Calculated image y: ${imgY}
    `);

    console.log(`
      image rect x: ${imageRect.x}, 
      image rect y: ${imageRect.y}, 
      image rect width: ${imageRect.width}, 
      image rect height: ${imageRect.height}
    `);

    console.log(`
      Image natural width * scale: ${imgNaturalWidth * transform[0]},
      Image natural height * scale: ${imgNaturalHeight * transform[3]},
      image rect width * scale: ${imageRect.width * transform[0]}, 
      image rect height * scale: ${imageRect.height * transform[3]};  
    `);

    console.log(`
      Result Crop X: ${(selection.x - imgX) / scaleX}
      Result Crop Y: ${(selection.y - imgY) / scaleY}
      Result Crop Width: ${selection.width / scaleX}
      Result Crop Height: ${selection.height / scaleY}
      ----------------`);
  } else {
    console.log('No crop data available');
  }
});

