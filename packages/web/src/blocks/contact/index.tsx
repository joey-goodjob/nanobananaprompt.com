import React from "react";
import { MapPin, Mail } from "lucide-react";
import { FaDiscord } from "react-icons/fa"; // 引入 Discord 图标

export function Contact() {
  return (
    <section>
      {/* Container */}
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-20">
        {/* Component */}
        <div className="grid items-center gap-8 sm:gap-20 md:grid-cols-5">
          <div className="md:col-span-2 max-w-3xl">
            {/* Title */}
            <h2 className="mb-2 text-3xl font-bold md:text-5xl">
              We’d love to connect.
            </h2>
            <p className="my-4 max-w-lg pb-4 text-sm sm:text-base md:mb-6 lg:mb-8" style={{ color: 'var(--text-secondary)' }}>
              Vumiai is built for creators who love turning ideas into visuals.
              Got feedback, a cool idea, or want to collaborate? Reach out —
              we’d love to connect!
            </p>
            {/* Testimonial */}
            <div className="mb-4 flex items-center" style={{ color: 'var(--banana-400)' }}>
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"
                ></path>
              </svg>
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"
                ></path>
              </svg>
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"
                ></path>
              </svg>
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"
                ></path>
              </svg>
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"
                ></path>
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex">
                {/* <div className="flex flex-col">
                  <h6 className="text-base font-bold">Niki</h6>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Boombest Seller</p>
                </div> */}
              </div>
              <div className="mt-6 p-4 rounded-lg shadow-sm border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--surface-border)' }}>
                {/* ----- 联系方式：改为邮箱 + Discord（参考 FloatingContactButtons.tsx 7-13）----- */}
                <div className="mt-6 p-4 rounded-lg shadow-sm border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--surface-border)' }}>
                  {/* 邮箱 */}
                  <div className="flex items-center mb-2">
                    <Mail className="h-5 w-5 mr-2" style={{ color: 'var(--primary)' }} />
                    <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      Email:{" "}
                      <a
                        href="mailto:hello@vumiai.com"
                        style={{ color: 'var(--primary)' }}
                      >
                        hello@vumiai.com
                      </a>
                    </p>
                  </div>

                  {/* Discord */}
                  <div className="flex items-center mb-2">
                    <FaDiscord className="h-5 w-5 mr-2" style={{ color: 'var(--accent)' }} />
                    <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      Discord:{" "}
                      <a
                        href="https://discord.gg/qJsjGkyyxE"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent)' }}
                      >
                        Join our Discord
                      </a>
                    </p>
                  </div>

                  {/* 地址保留
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-1" style={{ color: 'var(--text-secondary)' }} />
                    <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-medium">Address:</span> Longguang
                      Wisdom Valley, No. 6 Lianfeng New Road, Dalingshan Town,
                      Dongguan City
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-3 w-full p-8" style={{ backgroundColor: 'var(--surface-secondary)' }}>
            {/* Google Form 嵌入式 - 增加宽度版本 */}
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScHmRQUa0XDP7nGHkY-OElDRg1YzGubQAs0Ere2Sdl_19MUOw/viewform?embedded=true"
              width="100%"
              height="700"
              frameBorder="0"
              className="rounded-md w-full"
            >
              正在加载…
            </iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
