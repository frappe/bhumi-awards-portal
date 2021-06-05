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


function populateRankTable(collegeData) {
    
}

frappe.call({
    method: 'bhumi_awards_portal.api.get_colleges_by_rank',
    callback: (data) => {
      populateRankTable(data.message);
    }
});