import React, { useState, useEffect } from "react";

const EncryptionForm = () => {
	const [algorithm, setAlgorithm] = useState("");
	const [keyLengths, setKeyLengths] = useState([]);

	useEffect(() => {
		const updateKeyLengths = () => {
			const keyLengthSelect = document.getElementById("keyLength");
			keyLengthSelect.innerHTML = ""; // Clear existing options

			if (algorithm === "AES") {
				setKeyLengths([128, 192, 256]);
			} else {
				setKeyLengths([]);
			}
		};

		updateKeyLengths();
	}, [algorithm]);

	return (
		<div>
			<label htmlFor="encAlgorithm">Encryption Algorithm:</label>
			<select
				id="encAlgorithm"
				value={algorithm}
				onChange={(e) => setAlgorithm(e.target.value)}
			>
				<option value="">Select Algorithm</option>
				<option value="AES">AES</option>
				{/* Add more options as needed */}
			</select>

			<label htmlFor="keyLength">Key Length:</label>
			<select id="keyLength">
				{keyLengths.map((length) => (
					<option key={length} value={length}>
						{length}
					</option>
				))}
			</select>
		</div>
	);
};

export default EncryptionForm;
