// ==UserScript==
// @name		Copy Jira story ID
// @version		2.4
// @description	Copy story IDs from Jira tickets
// @author		MikeG
// @match		https://*.atlassian.net/*
// @updateURL	https://github.com/M-Garrett/MG-Browser-Scripts/raw/main/JiraStoryCopy.user.js
// @downloadURL	https://github.com/M-Garrett/MG-Browser-Scripts/raw/main/JiraStoryCopy.user.js
// @grant		GM_setClipboard
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_registerMenuCommand
// ==/UserScript==

const promptForPrefix = () => {
	const value = prompt('(Initial setup) Branch prefix (e.g. "jsmith/"), leave blank for none:', GM_getValue('prefix', ''))
	if (value !== null) GM_setValue('prefix', value.trim())
}

GM_registerMenuCommand('Set branch prefix', promptForPrefix)

document.addEventListener('click', e => {
	const elm = e.target.closest('[data-testid="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container"] a[href^="/browse/"]')
	if (!elm) return

	const ticketId = elm.innerText.trim()
	if (e.ctrlKey) {
		// Ask for the prefix on first use, so new users don't have to find the menu
		if (GM_getValue('prefix') === undefined) promptForPrefix()
		const prefix = GM_getValue('prefix', '')

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
