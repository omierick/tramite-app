import { useState } from "react";
import { supabase } from "../services/supabaseClient";

const FileUploadLogo = ({ onUpload }) => {
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from("logos-tramites")
            .upload(fileName, file);

        if (error) {
            alert("Error al subir logo");
            console.error(error);
            setLoading(false);
            return;
        }

        const { data: urlData } = supabase.storage
            .from("logos-tramites")
            .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
            onUpload(urlData.publicUrl);
        }

        setLoading(false);
    };

    return (
        <div>
            <label>Logo opcional:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
            {loading && <p>Subiendo...</p>}
        </div>
    );
};

export default FileUploadLogo;