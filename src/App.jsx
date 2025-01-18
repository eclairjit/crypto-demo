function App() {
	return (
		<>
			<div className="w-screen bg-zinc-950 h-screen flex-wrap space-x-2 space-y-4 justify-center p-2">
				<div className="flex space-x-4 ">
					<div>
						<label htmlFor="prime-p"></label>
						<input id="prime-p" type="text" placeholder="Enter prime" />
					</div>

					<div>
						<label htmlFor="prime-q"></label>
						<input id="prime-q" type="text" placeholder="Enter prime" />
					</div>
				</div>

				<div>
					<div>
						<label htmlFor="n"></label>
						<input id="n" type="text" placeholder="n = p * q" />
					</div>

					<div>
						<label htmlFor="phi"></label>
						<input id="phi" type="text" placeholder="φ(n) = (p-1) * (q-1)" />
					</div>
				</div>

				<div>
					<div>
						<label htmlFor="e"></label>
						<input
							id="e"
							type="text"
							placeholder="e has to be coprime to φ(n)"
						/>
					</div>

					<div>
						<label htmlFor="d"></label>
						<input
							id="d"
							type="text"
							placeholder="d has to be congruent to e"
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
