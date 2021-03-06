let store = Immutable.Map({
  rovers: ["Curiosity", "Opportunity", "Spirit"],
  selected: "0",
  roverData: {},
  loading: false
});

// add our markup to the page
const root = document.getElementById("root");
let roverSelect;

const updateStore = (state, newState) => {
  store = state.merge(newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state.toJS());
  roverSelect = document.getElementById("rover");
  if (roverSelect) {
    roverSelect.addEventListener("change", async e => {
      updateStore(store, { loading: true });
      const roverDataAsync = getRoverData(e.target.value);
      const roverData = await roverDataAsync();
      updateStore(store, {
        selected: e.target.value,
        roverData,
        loading: false
      });
    });
  }
};

// create content
const App = state => {
  let { rovers, selected, roverData, loading } = state;

  return `
          ${
            loading
              ? `<h1>Loading...</h1>`
              : `
                <div class="container">
                <header class="header"> 
                  ${RoverSelector(rovers, selected)}
                </header>
                ${RoverData(roverData, selected)}
                ${RoverPhotos(generatePhotos, roverData, selected)}
                </div>
                `
          }
        
        `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", async () => {
  await render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.

//rover selector component
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

// rover data display component
const RoverData = (roverData, selected) => {
  return selected == "0"
    ? ``
    : `
              <section class="info">
                  <h1>Rover info</h1>
                  <p>Name: ${selected}</p>
                  <p>Launch date: ${roverData.launch_date}</p>
                  <p>Landing Date: ${roverData.landing_date}</p>
                  <p>Photos Date: ${roverData.max_date}</p>
                  <p>Status: ${roverData.status}</p>
              </section>
              
              `;
};

// Higher Order Function That takes afunction as argument
// rover photos display component
const RoverPhotos = (callback, roverData, selected) => {
  return selected == "0"
    ? ``
    : `
      <h1 class="gallery-header">${selected} most recent photos</h1>
      <section class="gallery">
        ${callback(roverData)}
        
      </section>
      `;
};

function generatePhotos(roverData) {
  return roverData.photos
    .map(photo => `<img class="img" src="${photo}" alt="${photo}" ></img>`)
    .reduce((prev, photo) => prev + photo);
}

// ------------------------------------------------------  API CALLS
// Get Rover data from back-end
// The returned data object will contain rover data as well as most recent photos

//Higher order function that returns a function
const getRoverData = rover => {
  const roverDataAsync = async () => {
    const res = await fetch(`http://localhost:3000/rover?rover=${rover}`);
    const data = await res.json();
    return data;
  };

  return roverDataAsync;
};
