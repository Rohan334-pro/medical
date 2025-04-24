import React, { useState } from "react";
import axios from "axios";
import styles from "./SkinDetection.module.css";

const BASE_URL = "https://78b3-35-221-215-50.ngrok-free.app"


const SkinDetection = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("file");

    if (!fileInput.files[0]) {
      setError("Please upload an image.");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      const response = await axios.post(`${BASE_URL}/predict`, formData);
      setPrediction(response.data);
    } catch (err) {
      setError("Failed to process image. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Skin Disease Detection</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="file" className="form-label">Upload Skin Image</label>
          <input type="file" className="form-control" id="file" accept="image/*" required />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Processing..." : "Predict Disease"}
        </button>
      </form>

      {loading && (
        <div className={`${styles.spinner} mt-4`}>
          <p className={styles.loadingText}>Analyzing the image...</p>
          <div className="spinner-border text-primary"></div>
        </div>
      )}

      {error && <div className={`${styles.errorMessage} mt-4`}>{error}</div>}

      {prediction && (
        <div className={`${styles.result} mt-4`}>
          <h5>Prediction: {prediction.prediction} ✅</h5>
          <p><strong>Confidence:</strong> {prediction.confidence}%</p>
          <p><strong>Description:</strong> {prediction.description}</p>
          <p><strong>Causes:</strong> {prediction.causes}</p>
          <p><strong>Diagnosis:</strong> {prediction.diagnosis}</p>
          <p><strong>Treatment:</strong> {prediction.treatment}</p>
        </div>
      )}
    </div>
  );
};

export default SkinDetection;
