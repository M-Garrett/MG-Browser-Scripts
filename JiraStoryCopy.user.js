// ==UserScript==
// @name		Copy Jira story ID
// @version		2.3
// @description	Copy story IDs from Jira tickets
// @author		MikeG
// @match		https://*.atlassian.net/*
// @updateURL	https://github.com/M-Garrett/MG-Browser-Scripts/raw/main/JiraStoryCopy.user.js
// @downloadURL	https://github.com/M-Garrett/MG-Browser-Scripts/raw/main/JiraStoryCopy.user.js
// @grant		GM_setClipboard
// ==/UserScript==

// ---- Include your prefix here ----
const prefix = 'mgarrett/'
// ----------------------------------

document.addEventListener('click', e => {
	const elm = e.target.closest('[data-testid="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container"] a[href^="/browse/"]')
	if (!elm) return

	const ticketId = elm.innerText.trim()
	if (e.ctrlKey) {
		let title = document.querySelector('[data-testid="issue.views.issue-base.foundation.summary.heading"]').innerText.trim()
		// Make the title git-safe
		title = title.replace(/'/g, '') // Remove apostrophes instead of replacing with '-'
        title = title.replace(/&/g, '-and-') // Replace & as they break various systems
		title = title.replace(/\/\.|\.lock$|^\.|\.\.|\.| |~|'|`|\^|:|\?|\*|\(|\)|\[|^\/|\/$|\/\/|\.$|@{|^@$|\\|^-|-$/g, '-')
		// Clean up consecutive dashes
		title = title.replace(/\-{2,}/g, '-')
		GM_setClipboard(`${prefix}${ticketId}-${title}`)
	} else {
		GM_setClipboard(ticketId)
	}
	e.preventDefault()
	e.stopPropagation()
})

