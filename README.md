# Q-MIZAN

**Quantum sensors that weigh the CO2 being turned into rock in Fujairah’s mountains.**

Our project website for the ATRC School Program Quantum Challenge 2026–27 (Module 01: Quantum).

In Fujairah, CO2 is dissolved in seawater and injected into peridotite rock, where it turns into solid carbonate. Every tonne has to be proven to stay locked away before it counts toward net zero or earns carbon credits. Q-MIZAN uses quantum gravimeters, sensors that use falling clouds of ultracold atoms, to measure the tiny extra pull of gravity as carbon builds up underground. Rising gravity shows carbon arriving; steady gravity shows it staying put. (Mizan, ميزان, means "scale" or "balance" in Arabic.)

## Pages

| Page | What it covers |
| --- | --- |
| `index.html` | Overview of the idea |
| `challenge.html` | Fujairah's carbon-to-rock projects and why proving them is hard |
| `technology.html` | How an atom interferometer works (animated), the physics, our sensor network |
| `lab.html` | Three interactive simulations: signal calculator, month-by-month monitoring, sensor network map |
| `impact.html` | Benefits for the UAE, people and the world; honest limits; TRL and next steps |
| `research.html` | Timeline of key research, glossary and sources |
| `team.html` | Our team, teacher and school |

Our full proposal (ATRC template) is in `assets/docs/Q-MIZAN_Proposal.pptx`.

## The physics in the simulations

- Compact mass: `Δg = G·M / r²`
- Spread-out carbon (sensor map): sum of `G·m·z / (ρ² + z²)^1.5` over 400 small masses
- 1 µGal = 10⁻⁸ m/s². Field quantum gravimeters resolve about 5 µGal.

These are simplified models for a school proposal. Real sites need corrections for rain, tides, temperature and terrain.

## Team

Saeed Alketbi · Mansour Almenhali · Saeed Alzubaidi · Sultan Alameri · Rashed Alhantoobi
Teacher: Nidal Saleh · ATS Abu Dhabi Boys

## Run it

It is a plain static website: open `index.html` in a browser, or host it with GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).
