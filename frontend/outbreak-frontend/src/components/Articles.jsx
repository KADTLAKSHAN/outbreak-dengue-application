function Articles() {
  return (
    <section className="section" id="articles">
      <div className="container mx-auto">
        <h2 className="h2 mb-[50px] text-center xl:text-left">
          Our Recents Posts
        </h2>
        {/* posts */}
        <div className="flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 items-center lg:justify-between">
          {/* post 1 */}
          <div className="max-w-[420px] shadow-current rounded-[10px] overflow-hidden cursor-pointer group">
            {/* image */}
            <div className="relative overflow-hidden">
              <img
                className="group-hover:scale-110 translate-all duration-500"
                src="./src/assets/about.png"
                alt=""
              />
              {/* badge */}
              <div className="bg-amber-200 absolute bottom-0 left-0 text-white text-base tracking-[2.24px] font-medium uppercase py-[6px] px-[18px]">
                Dengue
              </div>
            </div>
            {/* text */}
            <div className="px-5 py-6">
              {/* date */}
              <div className="mb-4">Jan 2, 2025</div>
              {/* title */}
              <h4 className="h4 mb-[10px] ">
                10 foods to avoid for your heart health
              </h4>
              {/* description */}
              <p className="font-light">
                It's normal to feel anxiety, worry and grief any time you're
                diagnosed with a condition that's certainly true..
                <a href="" className="italic underline text-[#c6cfd1]">
                  Read more
                </a>
              </p>
            </div>
          </div>

          {/* post 2 */}
          <div className="max-w-[420px] shadow-current rounded-[10px] overflow-hidden cursor-pointer group">
            {/* image */}
            <div className="relative overflow-hidden">
              <img
                className="group-hover:scale-110 translate-all duration-500"
                src="./src/assets/about.png"
                alt=""
              />
              {/* badge */}
              <div className="bg-amber-200 absolute bottom-0 left-0 text-white text-base tracking-[2.24px] font-medium uppercase py-[6px] px-[18px]">
                Dengue
              </div>
            </div>
            {/* text */}
            <div className="px-5 py-6">
              {/* date */}
              <div className="mb-4">Jan 2, 2025</div>
              {/* title */}
              <h4 className="h4 mb-[10px] ">
                10 foods to avoid for your heart health
              </h4>
              {/* description */}
              <p className="font-light">
                It's normal to feel anxiety, worry and grief any time you're
                diagnosed with a condition that's certainly true..
                <a href="" className="italic underline text-[#c6cfd1]">
                  Read more
                </a>
              </p>
            </div>
          </div>

          {/* post 3 */}
          <div className="max-w-[420px] shadow-current rounded-[10px] overflow-hidden cursor-pointer group">
            {/* image */}
            <div className="relative overflow-hidden">
              <img
                className="group-hover:scale-110 translate-all duration-500"
                src="./src/assets/about.png"
                alt=""
              />
              {/* badge */}
              <div className="bg-amber-200 absolute bottom-0 left-0 text-white text-base tracking-[2.24px] font-medium uppercase py-[6px] px-[18px]">
                Dengue
              </div>
            </div>
            {/* text */}
            <div className="px-5 py-6">
              {/* date */}
              <div className="mb-4">Jan 2, 2025</div>
              {/* title */}
              <h4 className="h4 mb-[10px] ">
                10 foods to avoid for your heart health
              </h4>
              {/* description */}
              <p className="font-light">
                It's normal to feel anxiety, worry and grief any time you're
                diagnosed with a condition that's certainly true..
                <a href="" className="italic underline text-[#c6cfd1]">
                  Read more
                </a>
              </p>
            </div>
          </div>

          {/* post 4 */}
          <div className="max-w-[420px] shadow-current rounded-[10px] overflow-hidden cursor-pointer group">
            {/* image */}
            <div className="relative overflow-hidden">
              <img
                className="group-hover:scale-110 translate-all duration-500"
                src="./src/assets/about.png"
                alt=""
              />
              {/* badge */}
              <div className="bg-amber-200 absolute bottom-0 left-0 text-white text-base tracking-[2.24px] font-medium uppercase py-[6px] px-[18px]">
                Dengue
              </div>
            </div>
            {/* text */}
            <div className="px-5 py-6">
              {/* date */}
              <div className="mb-4">Jan 2, 2025</div>
              {/* title */}
              <h4 className="h4 mb-[10px] ">
                10 foods to avoid for your heart health
              </h4>
              {/* description */}
              <p className="font-light">
                It's normal to feel anxiety, worry and grief any time you're
                diagnosed with a condition that's certainly true..
                <a href="" className="italic underline text-[#c6cfd1]">
                  Read more
                </a>
              </p>
            </div>
          </div>

          {/* post 5 */}
          <div className="max-w-[420px] shadow-current rounded-[10px] overflow-hidden cursor-pointer group">
            {/* image */}
            <div className="relative overflow-hidden">
              <img
                className="group-hover:scale-110 translate-all duration-500"
                src="./src/assets/about.png"
                alt=""
              />
              {/* badge */}
              <div className="bg-amber-200 absolute bottom-0 left-0 text-white text-base tracking-[2.24px] font-medium uppercase py-[6px] px-[18px]">
                Dengue
              </div>
            </div>
            {/* text */}
            <div className="px-5 py-6">
              {/* date */}
              <div className="mb-4">Jan 2, 2025</div>
              {/* title */}
              <h4 className="h4 mb-[10px] ">
                10 foods to avoid for your heart health
              </h4>
              {/* description */}
              <p className="font-light">
                It's normal to feel anxiety, worry and grief any time you're
                diagnosed with a condition that's certainly true..
                <a href="" className="italic underline text-[#c6cfd1]">
                  Read more
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Articles;
