let store = {
  rovers: ["Curiosity", "Opportunity", "Spirit"],
  selected: "0",
  roverData: {}
};

// add our markup to the page
const root = document.getElementById("root");
let roverSelect;

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
  roverSelect = document.getElementById("rover");
  roverSelect.addEventListener("change", e => {
    updateStore(store, { selected: e.target.value });
  });
};

// create content
const App = state => {
  let { rovers, selected, roverData } = state;

  return `
        <div class="container">
        <header class="header"> 
          ${RoverSelector(rovers, selected)}
        </header>
        ${
          selected == "0"
            ? ``
            : `
              <section class="info">
                  <h1>Rover info</h1>
                  <p>Name: ${selected}</p>
                  <p>Launch date: 11/11/11</p>
                  <p>Landing Date: 11/11/11</p>
                  <p>Status: rover status</p>
              </section>
              <sections class="gallery"></sections>
              `
        }
        
    </div>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", async () => {
  await render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const RoverSelector = (rovers, selected) => {
  return `
            <select name="rover" id="rover">
                <option value="0" disabled ${
                  selected == "0" ? `selected` : ``
                }>Select a rover</option>
                ${rovers.map(
                  rover =>
                    `<option value="${rover}" ${
                      selected == rover ? `selected` : ``
                    }>${rover}</option>`
                )}
            </select>`;
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = apod => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  console.log(photodate.getDate(), today.getDate());

  console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
};

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = state => {
  let { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => updateStore(store, { apod }));

  return data;
};
