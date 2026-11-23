function App() {
  return (
    <main>
      <div class="h-96 w-full hero" />
      <div class="absolute bg-white rounded-t-3xl top-80 h-full w-full flex flex-col items-center py-5 space-y-8 px-5">
        <h1 className="text-4xl font-semibold">Hiroz Active FC</h1>

        <div className="max-w-2xl">
          <div className="max-w-2xl space-y-5 sm:space-y-3 font-medium text-neutral-800">
            <p>
              The charity football match featuring Grassroot football players
              going head to head to raise vital funds for charity.
            </p>
            <p>The aim is to harness the power of football for good.</p>
            <p>
              By joining Hiroz active FC, you get to become part of a team
              united by a love for football to advance social well-being and
              help raise vital funds for charity.
            </p>
            <p>
              Many children in Zimbabwe are limited by poverty and economic
              hardship. Therefore, lack access to education. Money raised from
              this game will help Khaya Foundation to provide practical solution
              to ensure every child have access to education irrespective of
              their circumstance.
            </p>
            <p>Your support can help.</p>
          </div>

          <div className="flex py-3 flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-5 justify-center items-center">
            <div className="flex shadow p-5 rounded-xl space-x-3 w-[310px] md:w-[340px]">
              <div className="h-full w-1 rounded-full bg-purple-300" />
              <div className="flex-col space-y-2">
                <h3 className="text-lg font-medium">Cause</h3>
                <div className="flex space-x-3">
                  <span className="bg-purple-200 border-purple-300 text-purple-500 px-4 py-1 text-sm  sm:text-base border rounded-full">
                    Education
                  </span>
                  <span className="bg-purple-200 border-purple-300 text-purple-500 px-4 py-1 text-sm  sm:text-base border rounded-full">
                    International Aid
                  </span>
                </div>
              </div>
            </div>
            <div className="flex shadow p-5 rounded-xl space-x-3 w-[310px]">
              <div className="h-full w-1 rounded-full bg-orange-300" />
              <div className="flex-col space-y-2">
                <h3 className="text-lg font-medium">Fund Recipient</h3>
                <div className="flex space-x-3">
                  <a
                    href="https://khayafoundation.org"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-orange-200 border-orange-300 text-orange-500 px-4 py-1 border rounded-full text-sm  sm:text-base"
                  >
                    Khaya Foundation
                  </a>
                  <a
                    href="https://khayafoundation.org"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-orange-200 border-orange-300 text-orange-500 px-4 py-1 border rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-external-link"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" x2="21" y1="14" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-x-1 flex flex-col space-y-4 md:space-y-0 md:space-x-5  md:flex-row items-center">
            <div class="text-black flex items-center space-x-3 shadow p-4 rounded-xl w-[310px] md:w-[340px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-map-pin"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span class="font-medium text-black text-sm md:text-base">
                Club Des Sports, E Acton Ln, London W3 7HB
              </span>
            </div>
            <div class="text-balck flex items-center space-x-3 shadow p-4 rounded-xl w-[310px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-clock-4"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span class="font-medium text-black text-sm md:text-base">
                18 Nov 2023 • 4 - 6PM
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-1 py-3 w-full">
            <div className="flex shadow p-5 rounded-xl space-x-3 w-[334px]">
              <div className="h-full w-1 rounded-full bg-purple-300" />
              <div className="flex-col space-y-2">
                <h3 className="text-lg font-medium">Fundraising Goal</h3>
                <div className="flex space-x-3">
                  <span className="bg-purple-200 border-purple-300 text-purple-500 px-4 py-1 border rounded-full">
                    £300
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex space-y-3 sm:space-y-0 flex-col sm:flex-row-reverse items-center justify-center mt-10 mb-5">
            <a
              href="/donations"
              class="px-10 py-3 rounded-lg w-full bg-purple-700 font-medium text-sm text-white appearance-none text-center cursor-pointer sm:ml-3"
            >
              Signup
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
