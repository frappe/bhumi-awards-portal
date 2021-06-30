// DOM elements
const collegeListings = document.getElementById("college-listings");
const loadMoreButton = document.getElementById("load-more-button");
const applyButton = document.getElementById("apply-button");

// Global variables
let pageStart = 0;
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
applyButton.addEventListener("click", () => {
	resetState();
	loadNextPage();
});

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
		},
	});
	pageStart += pageLimit;
}

function appendToListings(collegeList) {
	if (collegeList.length === 0 || collegeList.length < pageLimit) {
		toggleLoadButton(true);
	}

	let cardHTML = "";
	let abbr = undefined;

	for (let college of collegeList) {
		const redirectPayload = new URLSearchParams({
			"redirect-to": "/vote?new=1#" + encodeURIComponent(college.name),
		});

		const redirect_to = redirectPayload.toString();

		abbr = frappe.get_abbr(college.name);

		cardHTML = `
			<div class="card cursor-pointer p-5 h-100">
				<div class="d-flex flex-row">
					<div>
						<div class="mx-auto mb-3 rounded-circle text-white d-flex align-items-center display-4 justify-content-center" style="height: 70px; width: 70px; background-color: #badc95;">
							${abbr}
						</div>
					</div>
					<div class="col my-auto">
						<h5 class="card-title font-weight-bold">${college.name}</h5>

						<div class="d-flex flex-col">
							<img alt="Location Icon" class="feature-icon" src="/assets/bhumi_awards_portal/images/location.png">
							<span class="card-text d-block mb-4">${college.location}</span>
						</div>
					</div>
				</div>
				<div class="d-flex justify-content-between align-items-center card-footer mt-auto bg-transparent">
					<div class="d-flex flex-col">
						<img alt="Location Icon" class="feature-icon" src="/assets/bhumi_awards_portal/images/vote.png">
						<span class="m-0 mr-3 p-0 mr-1">
							${college.total_votes}
							${college.total_votes == 1 ? "vote" : "votes"}
						</span>
					</div>

					<a href="/login?${redirect_to}" class="btn btn-primary">Vote Now</a>
				</div>
			</div>
		`

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
	for (let input of filterInputs) {
		filters[input.key] = input.ele.value;

		if (input.key === "sortBy") {
			filters.sortOrder =
				input.ele.value == "total_votes" ? "desc" : "asc";
		}
	}

	toggleLoadButton(false);
	collegeListings.innerHTML = "";
	pageStart = 0;
	pageLimit = 30;
}

// First load
frappe.ready(() => loadNextPage());

window.onscroll = function() {add_sticky_to_filter_area()};

// Get the header
var header = document.getElementById("filters-area");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function add_sticky_to_filter_area() {
	if (window.pageYOffset > sticky) {
		header.classList.add("sticky", "container-fluid");
		header.classList.remove("container");
	} else {
		header.classList.add("container");
		header.classList.remove("sticky", "container-fluid");
	}
}