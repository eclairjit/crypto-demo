import React, { useState, useEffect } from "react";
import "./RSAVisualizer.css";

function RSAVisualizer() {
	const [step, setStep] = useState(0);
	const [p, setP] = useState(null);
	const [q, setQ] = useState(null);
	const [message, setMessage] = useState("");
	const [rsaDetails, setRsaDetails] = useState(null);
	const [currentInput, setCurrentInput] = useState("");

	// Step-by-step RSA process
	const steps = [
		{
			title: "Prime Number Selection",
			description: "Enter the first prime number (p)",
			component: () => (
				<div className="input-step">
					<input
						type="number"
						value={currentInput}
						onChange={(e) => setCurrentInput(e.target.value)}
						placeholder="Enter first prime number (p)"
					/>
				</div>
			),
			validate: () => {
				const num = parseInt(currentInput);
				return isPrime(num) && num > 1;
			},
			onNext: () => {
				setP(parseInt(currentInput));
				setCurrentInput("");
			},
		},
		{
			title: "Second Prime Number",
			description: "Enter the second prime number (q)",
			component: () => (
				<div className="input-step">
					<input
						type="number"
						value={currentInput}
						onChange={(e) => setCurrentInput(e.target.value)}
						placeholder="Enter second prime number (q)"
					/>
				</div>
			),
			validate: () => {
				const num = parseInt(currentInput);
				return isPrime(num) && num > 1 && num !== p;
			},
			onNext: () => {
				setQ(parseInt(currentInput));
				setCurrentInput("");
			},
		},
		{
			title: "Calculate Modulus (n)",
			description: "Calculating n = p * q",
			component: () => (
				<div className="calculation-step">
					<p>
						n = {p} * {q} = {p * q}
					</p>
				</div>
			),
			validate: () => true,
			onNext: () => {
				// No additional action needed
			},
		},
		{
			title: "Calculate Euler's Totient (φ)",
			description: "Calculating φ = (p-1) * (q-1)",
			component: () => (
				<div className="calculation-step">
					<p>
						φ = ({p}-1) * ({q}-1) = {(p - 1) * (q - 1)}
					</p>
				</div>
			),
			validate: () => true,
			onNext: () => {
				// No additional action needed
			},
		},
		{
			title: "Select Public Key (e)",
			description: "Choose a coprime to φ",
			component: () => (
				<div className="input-step">
					<input
						type="number"
						value={currentInput}
						onChange={(e) => setCurrentInput(e.target.value)}
						placeholder="Enter public key (e)"
					/>
				</div>
			),
			validate: () => {
				const e = parseInt(currentInput);
				const phi = (p - 1) * (q - 1);
				return e > 1 && e < phi && gcd(e, phi) === 1;
			},
			onNext: () => {
				// Store e and calculate d
				const phi = (p - 1) * (q - 1);
				const e = parseInt(currentInput);
				const d = modInverse(e, phi);

				setRsaDetails({
					p,
					q,
					n: p * q,
					phi: (p - 1) * (q - 1),
					e,
					d,
				});

				setCurrentInput("");
			},
		},
		{
			title: "Enter Message",
			description: "Type the message to encrypt",
			component: () => (
				<div className="input-step">
					<input
						type="text"
						value={currentInput}
						onChange={(e) => setCurrentInput(e.target.value)}
						placeholder="Enter message to encrypt"
					/>
				</div>
			),
			validate: () => currentInput.trim().length > 0,
			onNext: () => {
				setMessage(currentInput);
				setCurrentInput("");
			},
		},
		{
			title: "Encryption",
			description: "Encrypting the message",
			component: () => {
				const encryptedHex = encrypt(message, rsaDetails.e, rsaDetails.n);
				return (
					<div className="encryption-step">
						<p>Original Message: {message}</p>
						<p>Encrypted Message (Hex): {encryptedHex}</p>
					</div>
				);
			},
			validate: () => true,
			onNext: () => {
				// No additional action needed
			},
		},
		{
			title: "Decryption",
			description: "Decrypting the message",
			component: () => {
				const encryptedHex = encrypt(message, rsaDetails.e, rsaDetails.n);
				const decryptedMessage = decrypt(
					encryptedHex,
					rsaDetails.d,
					rsaDetails.n
				);
				return (
					<div className="decryption-step">
						<p>Encrypted Message (Hex): {encryptedHex}</p>
						<p>Decrypted Message: {decryptedMessage}</p>
					</div>
				);
			},
			validate: () => true,
			onNext: () => {
				// Final step
			},
		},
	];

	// Utility Functions
	const isPrime = (num) => {
		if (num < 2) return false;
		for (let i = 2; i <= Math.sqrt(num); i++) {
			if (num % i === 0) return false;
		}
		return true;
	};

	const gcd = (a, b) => {
		while (b !== 0) {
			[a, b] = [b, a % b];
		}
		return a;
	};

	const modInverse = (e, phi) => {
		let d = 1;
		while ((d * e) % phi !== 1) {
			d++;
		}
		return d;
	};

	// Encryption Function (using Hex)
	const encrypt = (message, e, n) => {
		return message
			.split("")
			.map((char) => {
				const charCode = char.charCodeAt(0);
				// Use Math.pow and modulo for encryption
				const encrypted = BigInt(Math.pow(charCode, e) % n);
				return encrypted.toString(16).padStart(4, "0");
			})
			.join("");
	};

	// Decryption Function (using Hex)
	const decrypt = (encryptedHex, d, n) => {
		const chars = encryptedHex.match(/.{1,4}/g) || [];
		const decryptedText = chars
			.map((hex) => {
				// Use Math.pow and modulo for decryption
				const decrypted = BigInt(Math.pow(parseInt(hex, 16), d) % n);
				return String.fromCharCode(Number(decrypted));
			})
			.join("");

		console.log(decryptedText);

		return decryptedText;
	};
	// Handle Next Step
	const handleNext = () => {
		const currentStepObj = steps[step];

		// Validate current step
		if (currentStepObj.validate()) {
			// Perform any next step actions
			currentStepObj.onNext();

			// Move to next step
			setStep(step + 1);
		} else {
			alert("Invalid input. Please check and try again.");
		}
	};

	// Handle Previous Step
	const handlePrevious = () => {
		if (step > 0) {
			setStep(step - 1);
		}
	};

	return (
		<div className="rsa-visualizer">
			<h1>RSA Encryption Step-by-Step</h1>

			<div className="current-step">
				<h2>{steps[step].title}</h2>
				<p>{steps[step].description}</p>

				{steps[step].component()}
			</div>

			<div className="step-navigation">
				{step > 0 && <button onClick={handlePrevious}>Previous Step</button>}
				{step < steps.length - 1 && (
					<button onClick={handleNext}>Next Step</button>
				)}
			</div>
		</div>
	);
}

export default RSAVisualizer;
