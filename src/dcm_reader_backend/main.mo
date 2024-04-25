import Blob "mo:base/Blob";
import List "mo:base/List";

actor DcmUploader {
    private stable var files: List.List<(Text, Blob)> = List.nil(); // 빈 리스트로 초기화

    // 파일 업로드 함수
    public shared func uploadFile(filename: Text, data: Blob) : async Text {
        // 파일 리스트에 새 파일 추가
        files := List.push((filename, data), files);
        return "File uploaded successfully!";
    };
    
    // 업로드된 파일 목록을 반환하는 함수
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

    // 파일 데이터를 반환하는 함수
    public query func getFile(filename: Text) : async ?Blob {
        let found = List.find<(Text, Blob)>(
            files,
            func (tup : (Text, Blob)) : Bool {
                return tup.0 == filename;
            }
        );
        return switch (found) {
            case null {null};   // null인 경우 null 반환
            case (?(_, blob)) {?blob};// 파일 데이터(blob)만 추출하여 반환
        };
    };
};
