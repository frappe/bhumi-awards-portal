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

// DOM elements
const rankTableBody = document.getElementById('rank-table-body');

function populateRankTable(collegeData) {
    let html = '';

    for (college of collegeData) {
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

frappe.call({
    method: 'bhumi_awards_portal.api.get_colleges_by_rank',
    callback: (data) => {
      populateRankTable(data.message);
    }
});