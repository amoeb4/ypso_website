# Makefile

# Default browser URL
BROWSER_URL := http://localhost:5173

# Helper to open browser if possible
define open_browser
	@if command -v xdg-open > /dev/null; then \
		xdg-open $(BROWSER_URL); \
	else \
		echo "xdg-open not found, open $(BROWSER_URL) manually."; \
	fi
endef

run:
	gnome-terminal --tab -- bash -c "npm run dev -- --host; exec bash"
	sleep 1
	$(open_browser)
