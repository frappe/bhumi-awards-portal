import frappe
from bhumi_awards_portal.bhumi_awards_portal.doctype.college.college import College

@frappe.whitelist(allow_guest=True)
def get_colleges_by_rank(limit=None, name_query=None):
    return College.get_with_rank(limit=limit, name_query=name_query)

@frappe.whitelist(allow_guest=True)
def get_chart_data():
    top_10_colleges = College.get_with_rank(limit=10)
    chart_data = {
       "labels": [c.name for c in top_10_colleges],
       "datasets": [{
           "name": "Votes",
           "values": [c.total_votes for c in top_10_colleges]
       }]
    }
    return chart_data