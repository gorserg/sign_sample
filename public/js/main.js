// prepare object for sign - remove field dateModified and documents with signature
function prepareObject(json_object) {
    var result = json_object;
    delete result['dateModified'];
    // delete documents with signature
    if (json_object.documents) {
        for (var index = json_object.documents.length - 1; index >= 0; index--) {
            var document = json_object.documents[index];
            if (document.title === 'sign.p7s' && document.format === "application/pkcs7-signature") {
                result.documents.splice(index, 1);
            }
        }
    }
    return JSON.stringify(result);
}
