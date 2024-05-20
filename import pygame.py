import pygame
import sys
import random

# Initialize Pygame
pygame.init()

# Set up the game window
WIDTH, HEIGHT = 500, 600
win = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Dhrubird Patel")

# Load images with error handling
try:
    background = pygame.image.load('FlappyBG.png')  # Replace 'FlappyBG.png' with your background image file
    print("Background image loaded successfully.")
except pygame.error as e:
    print("Error loading background image:", e)
    pygame.quit()
    sys.exit()

try:
    bird_image = pygame.image.load('dhrubird.png')  # Replace 'dhrubird.png' with your bird image file
    print("Bird image loaded successfully.")
except pygame.error as e:
    print("Error loading bird image:", e)
    pygame.quit()
    sys.exit()

try:
    obstacle_image = pygame.image.load('pipe.png')  # Replace 'pipe.png' with your obstacle image file
    print("Obstacle image loaded successfully.")
except pygame.error as e:
    print("Error loading obstacle image:", e)
    pygame.quit()
    sys.exit()

# Bird class
class Bird:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.vel = 0
        self.gravity = 0.5

    def flap(self):
        self.vel = -10

    def move(self):
        self.vel += self.gravity
        self.y += self.vel
        # Constrain bird within the game window
        if self.y <= 0:
            self.y = 0
        elif self.y >= HEIGHT - bird_image.get_height():
            self.y = HEIGHT - bird_image.get_height()

    def draw(self):
        win.blit(bird_image, (self.x, self.y))

# Button class
class Button:
    def __init__(self, text, x, y, width, height, color, text_color):
        self.text = text
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.color = color
        self.text_color = text_color

    def draw(self, win):
        pygame.draw.rect(win, self.color, (self.x, self.y, self.width, self.height))
        font = pygame.font.Font(None, 36)
        text_surface = font.render(self.text, True, self.text_color)
        text_rect = text_surface.get_rect(center=(self.x + self.width // 2, self.y + self.height // 2))
        win.blit(text_surface, text_rect)

# Main function
def main():
    bird = Bird(50, HEIGHT // 2)
    obstacles = []
    obstacle_speed = 5
    obstacle_spawn_time = pygame.time.get_ticks() + 4000  # Delay by 4 seconds
    game_state = "RUNNING"  # Game state variable
    questions_avoided = 0
    font = pygame.font.Font(None, 36)  # Font for text rendering
    clock = pygame.time.Clock()

    # Game over button
    restart_button = Button("Restart", 150, HEIGHT // 2 + 50, 200, 50, (0, 255, 0), (0, 0, 0))

    while True:
        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and game_state == "RUNNING":
                    bird.flap()
            if event.type == pygame.MOUSEBUTTONDOWN and game_state == "GAME_OVER":
                if restart_button.x < event.pos[0] < restart_button.x + restart_button.width and \
                        restart_button.y < event.pos[1] < restart_button.y + restart_button.height:
                    # Restart game
                    bird = Bird(50, HEIGHT // 2)
                    obstacles.clear()
                    obstacle_spawn_time = pygame.time.get_ticks() + 4000
                    game_state = "RUNNING"
                    questions_avoided = 0

        # Update
        if game_state == "RUNNING":
            bird.move()

            # Spawn obstacles after delay
            if pygame.time.get_ticks() >= obstacle_spawn_time:
                if pygame.time.get_ticks() - obstacle_spawn_time > 1500:
                    obstacle_y = random.randint(50, HEIGHT - 250)
                    obstacles.append({'x': WIDTH, 'y': obstacle_y})

                    # Reset obstacle spawn time for next obstacle
                    obstacle_spawn_time = pygame.time.get_ticks() + random.randint(1500, 3000)

            # Move obstacles
            for obstacle in obstacles:
                obstacle['x'] -= obstacle_speed

            # Remove off-screen obstacles
            obstacles = [obstacle for obstacle in obstacles if obstacle['x'] + obstacle_image.get_width() > 0]

            # Collision detection
            bird_rect = pygame.Rect(bird.x, bird.y, bird_image.get_width(), bird_image.get_height())
            for idx, obstacle in enumerate(obstacles):
                obstacle_rect = pygame.Rect(obstacle['x'], obstacle['y'], obstacle_image.get_width(), obstacle_image.get_height())
                if bird_rect.colliderect(obstacle_rect):
                    print("Collision detected!")
                    game_state = "GAME_OVER"
                    break
            else:
                # Check if bird completely passed an obstacle without collision
                for obstacle in obstacles:
                    if obstacle['x'] + obstacle_image.get_width() < bird.x:
                        questions_avoided += 1
                        obstacles.remove(obstacle)
                    break
        # Render
        win.blit(background, (0, 0))  # Draw background image
        bird.draw()
        for obstacle in obstacles:
            win.blit(obstacle_image, (obstacle['x'], obstacle['y']))

        # Display game over message and questions avoided count
        if game_state == "GAME_OVER":
            text_surface = font.render("Dhru eventually answered a question!", True, (0, 0, 0))
            text_rect = text_surface.get_rect(center=(WIDTH // 2, HEIGHT - 50))
            win.blit(text_surface, text_rect)

            avoided_text_surface = font.render(f"Questions avoided by Dhru: {questions_avoided}", True, (0, 0, 0))
            avoided_text_rect = avoided_text_surface.get_rect(center=(WIDTH // 2, HEIGHT - 100))
            win.blit(avoided_text_surface, avoided_text_rect)

            # Draw restart button
            restart_button.draw(win)

        pygame.display.update()
        clock.tick(30)

if __name__ == "__main__":
    main()
