from django.db import models
from django.conf import (
    settings,
)
from django.core.validators import MinValueValidator, MaxValueValidator

AUTH_USER_MODEL = settings.AUTH_USER_MODEL


class Book(models.Model):

    author = models.CharField(max_length=200)
    title = models.CharField(max_length=255)

    owner = models.ForeignKey(
        AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="books",
    )

    book_file = models.FileField(
        upload_to="book_files/",
        null=True,
        blank=True,
    )

    def __str__(self):
        return f'"{self.title}" by {self.author}'


class ShelfSlot(models.Model):
    owner = models.ForeignKey(
        AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="shelf_slots",
    )

    # Location on the shelf, restricted to 1-30
    location = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(30)],
        unique=True,
    )

    book = models.OneToOneField(
        Book,
        on_delete=models.CASCADE,
        related_name="shelf_location",
    )

    color = models.CharField(max_length=50)

    class Meta:
        ordering = ["owner", "location"]

    def __str__(self):
        book_title = self.book.title if self.book else "Empty"
        owner_username = self.owner.username
        return f"Slot {self.location} ({self.color}) for {owner_username} - Contains: {book_title}"
