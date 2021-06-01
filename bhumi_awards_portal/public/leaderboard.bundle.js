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