
- Fix issue preventing images thumbnails from being displayed in site settings

### 30 May 2017
- Fix issue where site page listing would not show all pages

### 18 May 2017
- Use ID as slug as fallback
- Add configurable transifex api key to site settings

### 02 May 2017
- Hide _id field from datasets
- 404 page when loading incorrect site slug
- Include datasets registered for "PREP" app

### 29 April 2017
- Fix issue on dataset/widget filter step.
- Adds support for more datatypes in chart widgets.
- Added metadata table modal to management section.
- Added metadata table modal to open content widgets.
- Added metadata table modal to analysis dashboards.

### 25 April 2017
- Add metadata fields to dataset creation and list
- Improved 404 page
- Added sitemap.xml and sitemap.html pages
- Responsive and cross-browser changes
- Fix issue on placement of content in site's page tree
- Improve widget rendering performance
- Fix populating of float and text values on widget creation
- Update robots.txt
- Inform users when loading outdated dashboard layouts

### 19 April 2017
- Change default site language to french
- Add Georgian translation support
- Warn users of unsupported social network login
- Fix issue with missing "style" options on site settings
- Prepend protocol to site links on admin interface

### 18 April 2017
- Fix issue with link page type creation
- Hide 2nd custom label input on pie charts
- Fix scatter charts
- Update positioning on label axis
- Fixes issue when deleting pages that contained widgets.
- Fixes issue where a delete button would appear in undeletable pages.
- Removes confusing slashed eye icon in the page position step.
- Grays-out disabled pages in the management page table.
- Includes dataset custom geo-fields in the dashboard widgets.
- Includes language selector on mobile menu.

### 6 April 2017
- Add custom labels support to widgets
- Added wysiwyg css cheatsheet
- Changes wysiwyg formatting styles
- Added debugging to custom router to identify potential issue when rebuilding
- Terms of Service page update
- Adds visibility toggle to dashboard widgets
- Widgets restyling
- Add option to select a site's default language

### 29 Mar 2017
- Add validation of template selection to site creation
- Improve site settings update
- Auto generate assets on deployment
- API upgrade
- Allow to pass data path to API for nested JSON documents
- Fixed some issues when creating ArcGIS datasets

### 22 Mar 2017
- Changes styles of cover attribution links.
- Added a context tab to the site management page.
- Adds styling for the ArcGIS embed maps.
- Added a default placeholder graph to the dashboard (used when the dataset is empty)
- Made the graphs translatable (possibility to translate the titles of the axes for example)
- Added the possibility to update the position and type of the dashboard's widgets
- Added the new dashboard layout
- Manager can add user to site

### 14 Mar 2017
- Improve support for ArcGIS services
- Update header text style

### 7 Mar 2017
- Adds HTML Blot to be able in insert html content into the wysiwyg
- Open image attribution on separate tab
- Show only site title on homepage banner
- Improve filters options on widget creation
- Fix issue on dataset filters with only one value
- Prevent widget from being deleted if they are being used on any page
- Define the role of the user per site instead of at user creation

### 28 Feb 2017
- Add links to share on Facebook, Twitter and G+ on page footers
- Add color highlight to 3rd level menu when element is selected
- Add attribution label + link to cover images.
- Add clear formatting button to WYSIWYG editor
- Update styling for Landscape applications
- Add site title to page header
- Add Google Analytics global + per site tracking features
- Add pre-footer
- Add supported translations languages per site
- Add meta tags to HTML + configurable "keywords" field per site
- Add contact email address to site settings
- Store links between pages and widgets
- Add "Go to live page" button on page save
- Makes link on admin more visible.
- Fixes deleting site urls

### 21 Feb 2017
- Added possibility to change the homepage's name
- Added token to datasets listing to bypass the API cache
- Added logs for all API calls
- Fixed an issue that prevented the map's settings to have color hightlighting
- Fixed session issue when editing multiple pages
- Added separator to dropdown menu in order to separate Admin, Management and Contexts from pages.
- Added scroll to dropdown menu in order to prevent menu getting too tall.

### 14 Feb 2017
- In a site's dataset listing, only the datasets belonging to a site's context are show, even for admins.
- Fixed bug that was duplicating the routes
- Added site's contexts and default contexts
- Fixed an issue where the breadcrumbs wouldn't appear for third-level pages
- Fixed an issue with the position of the breadcrumbs
- Redesigned the analysis dashboard
- Removed possibility to change the site's template
- Site's color is now shown

### 7 Feb 2017
- New sites now have only three default pages: homepage, map, terms & conditions
- Redesigned the settings step of the site creation / edition
- Added a new option to the images and widgets to let the user select their size between three options
- Improved the quality of the scaled down images "uploaded" through the wysiwyg
- Updated the map files
- Added a pagination system for the tables accross the app
- Fixed several issues with the dataset filtering: unable to set some string filters, misleading row count, unconsistent UI, etc.
- Added GFW's datasets to the application
- Improved the lists of datasets: removed the grouping by contexts (to avoid duplicates) and added a search field
- Removed the warning to prevent the user from uploading a CSV dataset served over HTTPs
- Fixed an issue where the favicon wouldn't work properly on Chrome and Firefox
- Fixed an issue where the list of sites wouldn't load under certain circumstances when using the quick links component
- Added links to the actual pages in the list of pages (management)

### 31 Jan 2017
- Added the new publisher role
- Added the possibility to choose the cover images and a site icon (admin)
- Removed the background color option (admin)
- Added a page where the users can edit there profile
- Added new alignment, indentation and list options to the wysiwyg
- Added the possibility to add a caption to the images and widgets
- Fixed an issue where the default dashboard would not load if the URL was corrupted
- Improved the performance of the wysiwyg by scaling down the images (could eventually cause a crash)
- Fixed an issue with the wysiwyg that would fetch a non-existing image
- Made the flag colors available/visible in the public sites
- Fixed an issue where the language selector would be behind the standalone map controls
- Added links to the actual sites in the list of sites (admin)
- Fixed an issue where the Turbolinks' progress bar wouldn't be visible in the admin section
- Fixed an issue where the dashboard's preview would not load due to missing geographical data
- Updated the maximum number of values per cell to 5 for the tables
- Fixed an issue with the list of a site's URLs when navigating back and forth between pages
- Fixed an issue with the table filtering when navigating back and forth between pages
