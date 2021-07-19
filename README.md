# **react-dom-to-video**

Small package that allows users to capture specific DOM elements as a video and export it.

<br>

## **How does it work?**

After specifying node that needs to be captured, It takes a screenshot of this specific DOM element using "html2canvas" package, screenshots can be triggered on state change and manually using the helper function. Collected frames/screenshots can be stitched together using "ffmpeg-wasm" to a video and exported when needed.

<br>

## **Be Aware**

-   Since WASM is relatively young some of the features used in this package are somewhat experimental and bound to change.
-   FFMPEG.WASM performance is not great because of browser limitations. It is recommended to **NOT** use more than ~100 frames, 100+ frame image to video conversion will take a considerably long time.

<br>

## **Installation**

```sh
npm install react-dom-to-video
```

<br>

## **Usage/Examples**

```js
import useVideoCapture from "react-dom-to-video";


// Inside component
const itemsContainer = useRef();
const [items, setItems] = useState([]);

const { startWatching, stopWatching, generateVideo, exportVideo } =
    useVideoCapture(
        itemsContainer.current, // node
        items, // trigger
    );

useEffect(() => {
    startWatching();

    const interval = setInterval(() => {
        setItems(items=> [...items, `item-${items?.length + 1}`]);
    }, 1000);

    return () => clearInterval(interval);
}, []);

return (
    <div
        ref={itemsContainer}
        style={{ width: "450px", height: "450px", overflow: "hidden" }}
        >
            {items.map(item => (
                <div key={item}>{item}</div>
            ))}
    </div>

    <button
        onClick={async () => {
            stopWatching();

            const video = await generateVideo();
            exportVideo(video);
        }}
    >
        Export
    </button>
)
```

<br>

### **useVideoCapture Hook Inputs**

|  Name   |             Description              |
| :-----: | :----------------------------------: |
|  node   |  DOM element that is being captured  |
| trigger |   State that triggers screenshots    |
| options | [View hook options](###Hook-Options) |

<br>

### **useVideoCapture Hook Output**

|     Name      |                         Description                         |
| :-----------: | :---------------------------------------------------------: |
|  isWatching   | tells you whether screenshots are being captured on trigger |
| startWatching |           start to capture screenshots on trigger           |
| stopWatching  |           stops to capture screenshots on trigger           |
|    frames     |            array of screenshots for current node            |
| generateFrame |   take a screenshot manually without waiting for trigger    |
| generateVideo |           generates a video from collected frames           |
|  videoSource  |                       generated video                       |
|  exportVideo  |                downloads the selected video                 |

<br>

### **useVideoCapture Hook Options**

```js
{
	frame: {
		filename: "frame",
		filetype: "png" || "jpeg",
		mime: "image/png" || "image/jpeg",
	},
	html2canvas: {
        // html2canvas options here
        // https://html2canvas.hertzen.com/configuration
	}
	video: {
		framerate: "1",
		filename: "video",
		filetype: "webm" || "mp4",
		mime: "video/webm" || "video/mp4",
	}
}
```
