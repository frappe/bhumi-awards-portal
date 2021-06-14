import { Chart } from "frappe-charts";

// Empty chart
let votesChart;

// Global variables
let nOfColleges = 10;

// DOM elements
const rankTableBody = document.getElementById("rank-table-body");
const searchInput = document.getElementById("search-input");
const refreshButton = document.getElementById("refresh-button");
const refreshButtonIcon = document.getElementById("refresh-button-icon");
const pageLimitButtons = document.getElementsByClassName("page-limit-button");

searchInput.addEventListener("input", (e) => {
	const inputQuery = e.target.value;
	refreshTable(nOfColleges, inputQuery);
});

refreshButton.addEventListener("click", (e) => {
	refreshButtonIcon.classList.add("spin"); // Start spinning
	refreshChart();
	refreshTable(nOfColleges, "").then(() =>
		refreshButtonIcon.classList.remove("spin")
	);
});

for (let b of pageLimitButtons) {
	b.addEventListener("click", (e) => {
		nOfColleges = e.target.innerHTML;

		if (nOfColleges == "ALL") {
			refreshTable();
		} else {
			refreshTable(parseInt(nOfColleges));
		}

		// Remove 'active' class from all buttons
		Array.from(pageLimitButtons).forEach((b) =>
			b.parentElement.classList.remove("active")
		);

		// Add to the clicked button
		e.target.parentElement.classList.add("active");
	});
}

function refreshTable(nOfColleges = null, nameQuery = "") {
	const args = {};

	if (nOfColleges) {
		args.limit = nOfColleges;
	}

	if (nameQuery) {
		args.name_query = nameQuery;
	}

	return frappe.call({
		method: "bhumi_awards_portal.api.get_colleges_by_rank",
		args: args,
		freeze: true,
		callback: (data) => {
			populateRankTable(data.message);
		},
	});
}

function populateRankTable(collegeData) {
	let html = "";

	for (let college of collegeData) {
		let rowHTML = `<tr>
            <th scope="row">${college.rank}</th>
            <td>${college.name}</td>
            <td>${college.total_votes}</td>
            <td>${college.location}</td>
          </tr>`;

		html += rowHTML;
	}

	rankTableBody.innerHTML = html;
}

function refreshChart() {
	// Fetch and populate chart
	frappe.call({
		method: "bhumi_awards_portal.api.get_chart_data",
		freeze: true,
		callback: ({ message }) => {
			votesChart = new Chart("#leaderboard-chart", {
				data: {
					datasets: message.datasets,
					labels: message.labels,
				},
				type: "bar",
				colors: ["#e28b22"],
			});
		},
	});
}

frappe.ready(() => {
	refreshChart();
	refreshTable(nOfColleges, "");
});

