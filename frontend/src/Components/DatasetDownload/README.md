draft

DatasetFetcher.jsx
fetchDataFromURL
async function to fetch data from a given url and the known extension of that raw file
included checks to ensure that the url given indeed points to a file (with an extension)
supported extension: csv and json
parse csv and json file and return accordingly
any other file extension, return as-is



DatasetDownloadDialog.jsx
heart and soul of dataset download user interface
purpose: allows the user to see the raw dataset(s) for a given project, including the possible multiple versions of those datasets, while displaying a preview of the raw datasets themselves
implementation:
- use a dialog for uninterrupted user experience
- dialog has maxWidth of `lg` --> looks like a popup on desktop. on smaller devices: the dialog expands to fullscreen to optimize screen real estate
- has several nested components (DatasetDownloadDialog, DatasetSelectorAndPreviewer, DatasetsTable...)
- use metadata from RawDatasetsMetadataContext to fetch the appropriate raw datasets and their versions for a particular project
- versions of a dataset is always defined as the date in format YYYY-MM-DD. rationale: most dataset only changes infrequently --> its date of modified can be used to denote its version. simple and understandable
- intially when the dialog is opened for the first time, fetches and displays a preview of the first dataset, with its latest version (in DatasetSelectorAndPreviewer)
- then, as the user interacts and chooses different datasets and/or different versions of a dataset --> fetched accordingly, with url taken from the RawDatasetsMetadataContext discussed above
- if a dataset has more than 3 versions, dont list all of the versions out in the dropdown menu. instead, use DatasetCalendar to display a calendar that highlights the date of the dataset that has a distinct version
- when the user clicks on the download button for a given dataset, use Blob to create a new download link for the fetched dataset --> no need to send the user to the actual raw file url to download it, nor requesting the dataset again
- saves fetched dataset in memory in the object fetchedDatasets so that switching between different datasets and versions dont require re-fetching, if already been fetched before --> optimize performance and user experience.
