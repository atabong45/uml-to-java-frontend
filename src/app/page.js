"use client";
import React, { useState } from "react";

const DrawIOJavaGenerator = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedZip, setGeneratedZip] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "application/xml" || file.name.endsWith(".drawio"))
    ) {
      setSelectedFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Seuls les fichiers .drawio sont autorisés");
      setSelectedFile(null);
    }
  };

  const generateJavaClasses = async () => {
    if (!selectedFile) {
      setErrorMessage("Veuillez sélectionner un fichier .drawio");
      return;
    }

    const formData = new FormData();
    formData.append("drawioFile", selectedFile);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/generate-java-classes",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la génération des classes");
      }

      const zipBlob = await response.blob();
      setGeneratedZip(zipBlob);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const downloadZip = () => {
    if (generatedZip) {
      const url = window.URL.createObjectURL(generatedZip);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "java-classes.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl p-8 bg-white shadow-2xl rounded-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Générateur de Classes Java
        </h1>

        <div className="mb-6">
          <input
            type="file"
            accept=".drawio"
            onChange={handleFileUpload}
            className="w-full p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {selectedFile && (
          <div className="mb-4 text-center text-green-600">
            <p>Fichier sélectionné : {selectedFile.name}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 text-center text-red-600">
            <p>{errorMessage}</p>
          </div>
        )}

        <button
          onClick={generateJavaClasses}
          disabled={!selectedFile}
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition duration-300 mb-4">
          Générer les Classes Java
        </button>

        {generatedZip && (
          <button
            onClick={downloadZip}
            className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
            Télécharger le ZIP
          </button>
        )}
      </div>
    </div>
  );
};

export default DrawIOJavaGenerator;
