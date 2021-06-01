import { Chart } from 'frappe-charts';

new Chart("#leaderboard-chart", {
    data: {
        labels: ["IIT Bombay", "IIT Kanpur", "NIT Raipur"],
        datasets: [
            {
                "name": "College",
                "values": [10, 20, 30]
            }
        ]
    },
    type: "bar"
});