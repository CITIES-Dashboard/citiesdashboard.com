draft

DatasetFetcher.jsx
fetchDataFromURL
async function to fetch data from a given url and the known extension of that raw file
included checks to ensure that the url given indeed points to a file (with an extension)
supported extension: csv and json
parse csv and json file and return accordingly
any other file extension, return as-is
