import { $, component$, useOnWindow, useSignal } from "@builder.io/qwik";
import { FaSunSolid, FaMoonSolid } from "@qwikest/icons/font-awesome";

export const DarkModeToggle = component$(() => {
  const isDarkMode = useSignal(false);

  const toggleDarkMode = $(() => {
    const newTheme = isDarkMode.value ? 'light' : 'dark';
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
    isDarkMode.value = !isDarkMode.value;
  });

  useOnWindow('load', $(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.className = savedTheme;
      isDarkMode.value = savedTheme === 'dark';
    }
  }));

  return (
    <button onClick$={toggleDarkMode} class="p-2 text-gray-800 dark:text-gray-200 font-medium rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition duration-200 ease-in-out">
      {isDarkMode.value ? <FaSunSolid /> : <FaMoonSolid />}
    </button>
  );
});