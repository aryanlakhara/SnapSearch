// Get the search form and input
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const status = document.getElementById("status");
const resultCount = document.getElementById("result-count");
const results = document.getElementById("results");


// When user searches
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = input.value.trim();

  // Don't search if input is empty
  if (!query) return;

  await searchImages(query);
});


// Search images from Wikimedia Commons
async function searchImages(query) {

  // LOADING STATE
  status.textContent = "Searching...";
  resultCount.textContent = "";
  results.innerHTML = "";

  const url =
    "https://commons.wikimedia.org/w/api.php?action=query" +
    "&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6" +
    "&gsrlimit=12" +
    "&prop=imageinfo" +
    "&iiprop=url" +
    "&iiurlwidth=300" +
    "&format=json" +
    "&origin=*";


  try {

    // Fetch data
    const response = await fetch(url);

    // Check for network/API error
    if (!response.ok) {
      throw new Error(response.status);
    }

    // Convert response to JSON
    const data = await response.json();

    // Get image items
    const items = data.query
      ? Object.values(data.query.pages)
      : [];


    // EMPTY STATE
    if (items.length === 0) {
      status.textContent = "No results. Try another search.";
      resultCount.textContent = "Showing 0 results.";
      return;
    }


    // RESULTS STATE
    status.textContent = "Search complete!";
    resultCount.textContent =
      "Showing " + items.length + " results.";

    render(items);

  } catch (error) {

    // ERROR STATE
    status.textContent =
      "Something went wrong. Please try again.";

    resultCount.textContent = "";
    results.innerHTML = "";

    console.error(error);
  }
}


// Display images on the page
function render(items) {
  const results = document.getElementById("results");

  results.innerHTML = "";

  items.forEach((item) => {

    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");

    if (item.imageinfo && item.imageinfo[0]) {
      img.src = item.imageinfo[0].thumburl;
    }

    img.alt = item.title || "Image";

    const caption = document.createElement("p");
    caption.textContent = item.title || "Untitled image";

    card.appendChild(img);
    card.appendChild(caption);

    results.appendChild(card);
  });
}