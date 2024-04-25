import Blob "mo:base/Blob";
import List "mo:base/List";

actor DcmUploader {
    private stable var files: List.List<(Text, Blob)> = List.nil(); // init to empty list

    // upload file
    public shared func uploadFile(filename: Text, data: Blob) : async Text {
        // add new file to file list
        files := List.push((filename, data), files);
        return "File uploaded successfully!";
    };
    
    // return the file list uploaded
    public query func listFiles() : async [Text] {
        let filenames = List.toArray(
            List.map<(Text, Blob), Text>(
                files,
                func (tup : (Text, Blob)) : Text {
                    return tup.0;
                }
            )
        );
        return filenames;
    };

    // return the file data 
    public query func getFile(filename: Text) : async ?Blob {
        let found = List.find<(Text, Blob)>(
            files,
            func (tup : (Text, Blob)) : Bool {
                return tup.0 == filename;
            }
        );
        return switch (found) {
            case null {null};   
            case (?(_, blob)) {?blob};
        };
    };
};
