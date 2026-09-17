const list = document.querySelector("#starred");
const status = document.querySelector("#status");

if (!list) {
  throw new Error("The starred repositories list element is missing.");
}

const updateStatus = (message, isError = false) => {
  if (!status) {
    return;
  }

  status.textContent = message;
  status.setAttribute("role", isError ? "alert" : "status");
  status.setAttribute("aria-live", isError ? "assertive" : "polite");
};

updateStatus("Loading starred repositories...");

fetch("events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  })
  .then((events) => {
    if (!Array.isArray(events)) {
      throw new TypeError("The events payload is not a valid array.");
    }

    list.innerHTML = "";

    events.forEach((event) => {
      const item = document.createElement("li");
      item.textContent = `${event.name} — starred ${event.starred}`;
      list.appendChild(item);
    });

    updateStatus(`Loaded ${events.length} starred repositories.`);
  })
  .catch((error) => {
    console.error("Unable to load starred repositories:", error);
    list.innerHTML = "";
    updateStatus("Unable to load starred repositories right now.", true);
  });
