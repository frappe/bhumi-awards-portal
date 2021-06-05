import { Chart } from 'frappe-charts';

new Chart("#leaderboard-chart", {
    data: {
        labels: ["IIT Bombay", "IIT Kanpur", "NIT Raipur", "Punjab University of Arts"],
        datasets: [
            {
                "name": "College",
                "values": [10, 20, 30, 100]
            }
        ]
    },
    type: "bar",
    colors: ["#e28b22"]
});

// Global variables
let nOfColleges = 10;

// DOM elements
const rankTableBody = document.getElementById('rank-table-body');
const refreshButton = document.getElementById('refresh-button');
const pageLimitButtons = document.getElementsByClassName('page-limit-button');

refreshButton.addEventListener('click', (e) => {
    refreshTable(nOfColleges, '');
});

for (let b of pageLimitButtons) {
    b.addEventListener('click', (e) => {
        nOfColleges = e.target.innerHTML;

        if (nOfColleges == 'ALL') {
            refreshTable();
        } else {
            refreshTable(parseInt(nOfColleges));
        }

        // Remove 'active' class from all buttons
        Array.from(pageLimitButtons).forEach(b => b.parentElement.classList.remove('active'));

        // Add to the clicked button
        e.target.parentElement.classList.add('active');
    });
}

function refreshTable(nOfColleges=null, nameQuery='') {
    const args = {};

    if (nOfColleges) {
        args.limit = nOfColleges;
    }
    
    if (nameQuery) {
        args.name_query = nameQuery;
    }

    frappe.call({
        method: 'bhumi_awards_portal.api.get_colleges_by_rank',
        args: args,
        callback: (data) => {
          populateRankTable(data.message);
        }
    });
}

function populateRankTable(collegeData) {
    let html = '';

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

refreshTable(nOfColleges, '');