// DOM elements
const collegeListings = document.getElementById("college-listings");
const loadMoreButton = document.getElementById("load-more-button");

// Global variables
let loading = false;
let pageStart = 30;
let pageLimit = 30;

let filters = {
	nameQuery: "",
	locationQuery: "",
	sortBy: "total_votes",
	sortOrder: "desc",
};

const filterInputs = [
	{ ele: document.getElementById("input-name-search"), key: "nameQuery" },
	{
		ele: document.getElementById("input-location-search"),
		key: "locationQuery",
	},
	{ ele: document.getElementById("input-sort"), key: "sortBy" },
];

// Event Listeners
for (let input of filterInputs) {
	input.ele.addEventListener("input", (e) => {
		filters[input.key] = e.target.value;

		if (input.key === "sortBy") {
			filters.sortOrder =
				e.target.value == "total_votes" ? "desc" : "asc";
		}

		resetState();
		loadNextPage();
	});
}

loadMoreButton.addEventListener("click", (e) => {
	loadNextPage();
});

function loadNextPage() {
	frappe.call({
		method: "bhumi_awards_portal.api.get_colleges",
		args: {
			limit_start: pageStart,
			order_by: `${filters.sortBy} ${filters.sortOrder}`,
			name_query: filters.nameQuery,
			location_query: filters.locationQuery,
		},
		freeze: true,
		callback: ({ message }) => {
			appendToListings(message);
			pageStart += pageLimit;
		},
	});
}

function appendToListings(collegeList) {
	if (collegeList.length === 0 || collegeList.length < pageLimit) {
		toggleLoadButton(true);
	}

	let cardHTML = "";
	for (let college of collegeList) {
		cardHTML = `
        <div class="card w-100 h-100">
            <div class="card-body text-center">
                <div class="mx-auto mb-3 rounded-circle bg-success text-white d-flex align-items-center display-4 justify-content-center" style="height: 100px; width: 100px;">${frappe.get_abbr(
					college.name
				)}</div>
                <h5 class="card-title font-weight-bold">${college.name}</h5>
                <p class="card-text d-block mb-4">${college.location}</p>
                <div class="d-flex justify-content-between align-items-center card-footer bg-transparent">
                    <p class="m-0 mr-3 p-0 mr-1 vote-count">
                        ${college.total_votes}
                        ${college.total_votes == 1 ? "vote" : "votes"}
                    </p>
                    <a href="/vote" class="btn btn-primary">Vote Now</a>
                </div>
            </div>
        </div>
`;

		// Append this card to college listings
		const cardElement = document.createElement("div");
		cardElement.classList.add("col-lg-4", "col-sm-12", "col-md-6", "mb-4");
		cardElement.innerHTML = cardHTML;
		collegeListings.append(cardElement);
	}
}

function toggleLoadButton(visible = true) {
	loadMoreButton.style.display = visible ? "none" : "block";
}

function resetState() {
	toggleLoadButton(false);
	collegeListings.innerHTML = "";
	pageStart = 0;
	pageLimit = 30;
}
