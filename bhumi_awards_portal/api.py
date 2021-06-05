import frappe
from bhumi_awards_portal.bhumi_awards_portal.doctype.college.college import College

@frappe.whitelist(allow_guest=True)
def get_colleges_by_rank(limit=None, name_query=None):
    return College.get_colleges_by_rank(limit=limit, name_query=name_query)