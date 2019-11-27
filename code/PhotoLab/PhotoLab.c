/*********************************************************************/
/* PhotoLab.c: Assignment 7 for EECS 10, Fall 2019 
* Program which allows the user to perform DIP operations on an image 
* @author template by EECS10 Department, function definitions added/modified by Timothy Do 
* Started November 14th, 2019, Modified Novemeber 22nd 2019 @Timothy Do               
*/
/*********************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*** global definitions ***/
#define WIDTH  480		/* image width */
#define HEIGHT 360		/* image height */
#define SLEN    80		/* maximum length of file names */

/*** function declarations ***/

/* print a menu */
void PrintMenu(void);

/* read image from a file */
int LoadImage(const char fname[SLEN], unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT]);

/* save a processed image */
int SaveImage(const char fname[SLEN], unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT]);

/* change a color image to black & white */
void BlackNWhite(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT]);

/* reverse image color */
void Negative(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT]);

/* flip image horizontally */
void HFlip(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT]);

/* mirror image horizontally */
void HMirror(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT]);

/* zoom into the image */
void Zoomin(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT]);

/* sharpen the image */
void Sharpen(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT]);

/* exchange R and G color channels */
void ExRG(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT]);

/* add salt-and-pepper noise to image */
void AddNoise(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT], int percentage);

/* add overlay image */
void Overlay(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT]);

/* add a border to the image */
void AddBorder(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT], int r, int g, int b, int bwidth);

/* Example: aging the photo */
void Aging(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT]);

/* test all functions */
void AutoTest(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT]);

/*
* Main function to run the program with the prompt
* @return 0 indicating the program was sucessful
*/
int main(void)
{
    /* Two dimensional arrays to hold the current image data, */
    /* one array for each color component.                    */
    unsigned char   R[WIDTH][HEIGHT];
    unsigned char   G[WIDTH][HEIGHT];
    unsigned char   B[WIDTH][HEIGHT];

    /* Addtional Variable Declerations */
    int input = 0; 
    char fileName[SLEN];
    int percent = 20;
    int red; 
    int green;
    int blue;
    int width;

    /* Please replace the following code with proper menu with function calls for DIP operations */
    while(input != 14)
    {
        PrintMenu();
        scanf("%d", &input);
        switch(input)
        {
            case 1: 
                printf("Please input the file name to load: ");
                scanf("%79s", fileName);
                LoadImage(fileName, R, G, B);
                break;
            case 2: 
                printf("Please input the file name to save: ");
                scanf("%79s", fileName);
                SaveImage(fileName, R, G, B);
                break;
            case 3: 
                BlackNWhite(R, G, B);
                break;
            case 4: 
                Negative(R, G, B);
                break;
            case 5: 
                HFlip(R, G, B);
                break;
            case 6: 
                HMirror(R, G, B);
                break;
            case 7:
                Zoomin(R, G, B);
                break;
            case 8: 
                Sharpen(R, G, B);
                break;
            case 9:
                ExRG(R, G, B);
                break; 
            case 10:
                AddNoise(R, G, B, percent);
                break;
            case 11:
                Overlay(R, G, B);
                break;
            case 12:
                printf("Enter the R value of the border color(0 to 255): ");
                scanf("%d", &red);
                printf("Enter the G value of the border color(0 to 255): ");
                scanf("%d", &green);
                printf("Enter the B value of the border color(0 to 255): ");
                scanf("%d", &blue);
                printf("Enter the width of the border: ");
                scanf("%d", &width);
                AddBorder(R, G, B, red, green, blue, width);
                break;
            case 13:
                AutoTest(R, G, B);
                break;
            case 14:
                break;
            default:
                printf("\nInvalid input, please try again!\n");
                break;
        }
    }
    /* End of replacing */

    return 0;
}

int LoadImage(const char fname[SLEN], unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT])
{
    FILE *File;
    char Type[SLEN];
    int  Width, Height, MaxValue;
    int  x, y;
    char ftype[] = ".ppm";
    char fname_ext[SLEN + sizeof(ftype)];

    strcpy(fname_ext, fname);
    strcat(fname_ext, ftype);

    File = fopen(fname_ext, "r");
    if (!File) {
        printf("\nCannot open file \"%s\" for reading!\n", fname);
        return 1;
    }
    fscanf(File, "%79s", Type);
    if (Type[0] != 'P' || Type[1] != '6' || Type[2] != 0) {
        printf("\nUnsupported file format!\n");
        return 2;
    }
    fscanf(File, "%d", &Width);
    if (Width != WIDTH) {
        printf("\nUnsupported image width %d!\n", Width);
        return 3;
    }
    fscanf(File, "%d", &Height);
    if (Height != HEIGHT) {
        printf("\nUnsupported image height %d!\n", Height);
        return 4;
    }
    fscanf(File, "%d", &MaxValue);
    if (MaxValue != 255) {
        printf("\nUnsupported image maximum value %d!\n", MaxValue);
        return 5;
    }
    if ('\n' != fgetc(File)) {
        printf("\nCarriage return expected!\n");
        return 6;
    }
    for (y = 0; y < HEIGHT; y++) {
        for (x = 0; x < WIDTH; x++) {
            R[x][y] = fgetc(File);
            G[x][y] = fgetc(File);
            B[x][y] = fgetc(File);
        }
    }
    if (ferror(File)) {
        printf("\nFile error while reading from file!\n");
        return 7;
    }
    printf("%s was read successfully!\n", fname_ext);
    fclose(File);
    return 0;
}

int SaveImage(const char fname[SLEN], unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT])
{
    FILE *File;
    char ftype[] = ".ppm";
    char fname_ext[SLEN + sizeof(ftype)];
    char SysCmd[SLEN * 5];
    int  x, y;

    strcpy(fname_ext, fname);
    strcat(fname_ext, ftype);

    File = fopen(fname_ext, "w");
    if (!File) {
        printf("\nCannot open file \"%s\" for writing!\n", fname);
        return 1;
    }
    fprintf(File, "P6\n");
    fprintf(File, "%d %d\n", WIDTH, HEIGHT);
    fprintf(File, "255\n");

    for (y = 0; y < HEIGHT; y++) {
        for (x = 0; x < WIDTH; x++) {
            fputc(R[x][y], File);
            fputc(G[x][y], File);
            fputc(B[x][y], File);
        }
    }

    if (ferror(File)) {
        printf("\nFile error while writing to file!\n");
        return 2;
    }
    fclose(File);
    printf("%s was saved successfully. \n", fname_ext);

    /*
     * rename file to image.ppm, convert it to ~/public_html/<fname>.jpg
     * and make it world readable
     */
    sprintf(SysCmd, "~eecs10/bin/pnmtojpeg.tcsh %s", fname_ext);
    if (system(SysCmd) != 0) {
        printf("\nError while converting to JPG:\nCommand \"%s\" failed!\n", SysCmd);
        return 3;
    }
    printf("%s.jpg was stored for viewing. \n", fname);

    return 0;
}

/* 
* Example: age the image to make it look like old picture 
*/
void Aging(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT])
{
    int x, y;

    for( y = 0; y < HEIGHT; y++ ) {
        for( x = 0; x < WIDTH; x++ ) {
	    B[x][y] = ( R[x][y]+G[x][y]+B[x][y] )/5;
            R[x][y] = (unsigned char) (B[x][y]*1.6);
            G[x][y] = (unsigned char) (B[x][y]*1.6);
	}
    }
}

/* 
* Test all functions 
* Modified by Timothy Do
*/
void AutoTest(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT])
{

    LoadImage("Iceland", R, G, B);
    BlackNWhite(R, G, B);
    SaveImage("bw", R, G, B);
    printf("Black & White tested!\n\n");
    LoadImage("Iceland", R, G, B);
    Negative(R, G, B);
    SaveImage("negative", R, G, B);
    printf("Negative tested!\n\n");
    LoadImage("Iceland", R, G, B);
    HFlip(R, G, B);
    SaveImage("hflip", R, G, B);
    printf("HFlip tested!\n\n");
    LoadImage("Iceland", R, G, B);
    HMirror(R, G, B);
    SaveImage("hmirror", R, G, B);
    printf("HMirror tested!\n\n");
    LoadImage("Iceland", R, G, B);
    Zoomin(R, G, B);
    SaveImage("zoomin", R, G, B);
    printf("Zoomin tested!\n\n");
    LoadImage("Iceland", R, G, B);
    Sharpen(R, G, B);
    SaveImage("sharpen", R, G, B);
    printf("Sharpen tested!\n\n");
    LoadImage("Iceland", R, G, B);
    ExRG(R, G, B);
    SaveImage("xRG", R, G, B);
    printf("ExRG tested!\n\n");
    LoadImage("Iceland", R, G, B);
    AddNoise(R, G, B, 20);
    SaveImage("noise", R, G, B);
    printf("AddNoise tested!\n\n");
    LoadImage("Iceland", R, G, B);
    Overlay(R, G, B);
    SaveImage("overlay", R, G, B);
    printf("Overlay tested!\n\n");
    LoadImage("Iceland", R, G, B);
    AddBorder(R, G, B, 0, 0, 0, 20);
    SaveImage("border", R, G, B);
    printf("AddBorder tested!\n\n");

}

/**************************************************************/
/* Please add your function definitions here... Added by Timothy Do               */
/**************************************************************/

/*
* Function to Print A Menu
* Definition Added by Timothy Do
*/
void PrintMenu(void)
{
    printf("\n----------------------------------------------\n" );
    printf("1: Load a PPM image\n");
    printf("2: Save the image in PPM and JPEG format\n");
    printf("3: Change the color image to black and white\n");
    printf("4: Make a negative of the image\n");
    printf("5: Flip the image horizontally\n");
    printf("6: Mirror the image horizontally\n");
    printf("7: Zoom into the image\n");
    printf("8: Sharpen the image\n");
    printf("9: Exchange the red and green color channels\n");
    printf("10: Add noise to an image\n");
    printf("11: Add overlay to an image\n");
    printf("12: Add border to an image\n");
    printf("13: Test all functions\n");
    printf("14: Exit\n");
    printf("----------------------------------------------\n" );
    printf("Please make your choice: ");


}

/* 
* Function to make the loaded picture black and white 
* Definition added by Timothy Do
*/
void BlackNWhite(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT])
{
    int i, j;
    for(i = 0; i < HEIGHT; i++)
    {
        for(j = 0; j < WIDTH; j++)
        {
            unsigned char tempR = R[j][i];
            unsigned char tempG = G[j][i];
            unsigned char tempB = B[j][i];
            R[j][i] = (tempR + tempG + tempB) / 3;
            G[j][i] = (tempR + tempG + tempB) / 3;
            B[j][i] = (tempR + tempG + tempB) / 3;
        }
    }
    printf("\"Black & White\" operation is done!\n");
}

/*
* Function to make the image negative
* Function definintion added by Timothy Do
*/
void Negative(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT])
{
    int i, j;
    for(i = 0; i < HEIGHT; i++)
    {
        for(j = 0; j < WIDTH; j++)
        {
            R[j][i] = 255 - R[j][i];
            G[j][i] = 255 - G[j][i];
            B[j][i] = 255 - B[j][i];
        }
    }
    printf("\"Negative\" operation is done!\n");
}

/*
* Function to "horizontally flip" the image
* Definition added by Timothy Do
*/
void HFlip(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT])
{
    int i, j;
    for(i = 0; i < HEIGHT; i++)
    {
        for(j = 0; j < WIDTH / 2; j++)
        {
            unsigned char tempR = R[j][i];
            unsigned char tempG = G[j][i];
            unsigned char tempB = B[j][i];
            R[j][i] = R[WIDTH - j - 1][i];
            R[WIDTH - j - 1][i] = tempR;
            G[j][i] = G[WIDTH - j - 1][i];
            G[WIDTH - j - 1][i] = tempG;
            B[j][i] = B[WIDTH - j - 1][i];
            B[WIDTH - j - 1][i] = tempB;
        }
    }
    printf("\"HFlip\" operation is done!\n");
}

/*
* Function to "Horizontally mirror"
* Definition added by Timothy Do
*/
void HMirror(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT])
{
    int i, j;
    for(i = 0; i < HEIGHT; i++)
    {
        for(j = WIDTH / 2; j < WIDTH; j++)
        {
            R[j][i] = R[WIDTH - j - 1][i];
            G[j][i] = G[WIDTH - j - 1][i];
            B[j][i] = B[WIDTH - j - 1][i];
        }
    }
    printf("\"HMirror\" operation is done!\n");
}

/*
* Function to zoom in on a picture
* Definition added by Timothy Do
*/
void Zoomin(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT])
{
    int i, j, l, m;
    unsigned zoomR[WIDTH][HEIGHT];
    unsigned zoomG[WIDTH][HEIGHT];
    unsigned zoomB[WIDTH][HEIGHT];
    /* Interesting Part */
    for(l = 0; l < 180; l++) 
    {
        for(m = 120; m < 360; m++)
        {
            zoomR[m][l] = R[m][l];
            zoomG[m][l] = G[m][l];
            zoomB[m][l] = B[m][l];
        }
    }
    /* Calculating Ratio for Interesting Part and Original Image */
    int ratioWidth = WIDTH / (m - 120);
    int ratioHeight = HEIGHT / l;
    /* Filling in the image with the ratio of interesting part and filling it iteratively */
    for(i = 0; i < HEIGHT - ratioHeight; i++)
    {
        for(l = 0; l <= ratioHeight; l++)
        {
            for(j = 0; j < WIDTH - ratioWidth; j++)
            {
                    for(m = 0; m <= ratioWidth; m++)
                    {
                    R[j + m][i + l] = zoomR[j / ratioWidth + 120][i / ratioHeight];
                    G[j + m][i + l] = zoomG[j / ratioWidth + 120][i / ratioHeight];
                    B[j + m][i + l] = zoomB[j / ratioWidth + 120][i / ratioHeight];
                    }
            }
        }
    }
    printf("\"Zoom\" operation is done!\n");
}

/*
* Function which "sharpens" the image
* Defintion added by Timothy Do
*/
void Sharpen(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT])
{
    int i, j, h, w;
    /*Store Original Image for Calculations */
    unsigned char tR[WIDTH][HEIGHT];
    unsigned char tG[WIDTH][HEIGHT];
    unsigned char tB[WIDTH][HEIGHT];
    /* Copying orignal pixels into new array */
    for(h = 0; h < HEIGHT; h++)
    {
        for(w = 0; w < WIDTH; w++)
        {
            tR[w][h] = R[w][h];
            tG[w][h] = G[w][h];
            tB[w][h] = B[w][h];
        }
    }
    /* Sharpen */
    for(i = 1; i < HEIGHT - 1; i++)
    {
        for(j = 1; j < WIDTH - 1; j++)
        {
            int red;
            red = -tR[j - 1][i - 1] - tR[j][i - 1] - tR[j + 1][i - 1] - tR[j - 1][i] + (9 * tR[j][i]) - tR[j + 1][i] - tR[j - 1][i + 1] - tR[j][i + 1] - tR[j + 1][i + 1];
            if(red >= 255)
            {
                R[j][i] = 255;
            }
            else if(red <= 0)
            {
                R[j][i] = 0;
            }
            else
            {
                R[j][i] = red;
            }
            int green;
            green = -tG[j - 1][i - 1] - tG[j][i - 1] - tG[j + 1][i - 1] - tG[j - 1][i] + (9 * tG[j][i]) - tG[j + 1][i] - tG[j - 1][i + 1] - tG[j][i + 1] - tG[j + 1][i + 1];
            if(green >= 255)
            {
                G[j][i] = 255;
            }
            else if(green <= 0)
            {
                G[j][i] = 0;
            }
            else
            {
                G[j][i] = green;
            }
            int blue;
            blue = -tB[j - 1][i - 1] - tB[j][i - 1] - tB[j + 1][i - 1] - tB[j - 1][i] + (9 * tB[j][i]) - tB[j + 1][i] - tB[j - 1][i + 1] - tB[j][i + 1] - tB[j + 1][i + 1];
            if(blue >= 255)
            {
                B[j][i] = 255;
            }
            else if(blue <= 0)
            {
                B[j][i] = 0;
            }
            else
            {
                B[j][i] = blue;
            }
        }
    }
    printf("\"Sharpen\" operation is done!\n");
}

/*
* Function that exchanges R and G channels of image
* Definition added by Timothy Do
*/
void ExRG(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT])
{
    int i, j;
    for(i = 0; i < HEIGHT; i++)
    {
        for(j = 0; j < WIDTH; j++)
        {
            unsigned char temp = R[j][i];
            R[j][i] = G[j][i];
            G[j][i] = temp;
        }
    }
    printf("\"Exchange RG\" operation is done!\n");
}

/*
* Function to add noise to the image 
* Definition added by Timothy Do
*/
void AddNoise(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT], int percentage)
{
    srand(0);
    int noisePixel = percentage * WIDTH * HEIGHT / 100;
    int i, x, y;
    for(i = 0; i < noisePixel; i++)
    {
        x = (double)rand() / (double)RAND_MAX * WIDTH;
        y = (double)rand() / (double)RAND_MAX * HEIGHT;
        /* Pepper Points */
        if(i % 2 == 0)
        {
            R[x][y] = 0;
            G[x][y] = 0;
            B[x][y] = 0;
        }
        /* Salt Points */
        else if(i % 2 == 1)
        {
            R[x][y] = 255;
            G[x][y] = 255;
            B[x][y] = 255;
        }

    }
    printf("\"Add noise\" operation is done!\n");
}

/*
* Function to put an overlay in the image
* Definition added by Timothy Do
*/
void Overlay(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT])
{
    int i, j;
    unsigned char overlayR[WIDTH][HEIGHT];
    unsigned char overlayG[WIDTH][HEIGHT];
    unsigned char overlayB[WIDTH][HEIGHT];
    LoadImage("anteater", overlayR, overlayG, overlayB);
    for(i = 0; i < HEIGHT; i++)
    {
        for(j = 0; j < WIDTH; j++)
        {
            /* Adding Overlay with Haze */
            if(overlayR[j][i] <= 240 && overlayG[j][i] <= 240 && overlayB[j][i] <= 240)
            {
                R[j][i] = overlayR[j][i];
                G[j][i] = overlayG[j][i];
                B[j][i] = overlayB[j][i];
            }
        }
    }
     printf("\"Overlay\" operation is done!\n");

}

/*
* Method to add border to image 
* Definition added by Timothy Do
*/
void AddBorder(unsigned char R[WIDTH][HEIGHT], unsigned char G[WIDTH][HEIGHT], unsigned char B[WIDTH][HEIGHT], int r, int g, int b, int bwidth)
{
    int i, j;
    /* Top of Border */
    for(i = 0; i < bwidth; i++)
    {
        for(j = 0; j < WIDTH; j++)
        {
            R[j][i] = r;
            G[j][i] = g;
            B[j][i] = b;
        }
    }
    /* Bottom of Border */
    for(i = HEIGHT - 1; i >= HEIGHT - bwidth; i--)
    {
        for(j = 0; j < WIDTH; j++)
        {
            R[j][i] = r;
            G[j][i] = g;
            B[j][i] = b; 
        }
    }
    /* Left of Border */
    for(i = 0; i < HEIGHT; i++)
    {
        for(j = 0; j < bwidth; j++)
        {
            R[j][i] = r;
            G[j][i] = g;
            B[j][i] = b;
        }
    }
    /* Right of Border */
    for(i = 0; i < HEIGHT; i++)
    {
        for(j = WIDTH - 1; j >= WIDTH - bwidth; j--)
        {
            R[j][i] = r;
            G[j][i] = g;
            B[j][i] = b;
        }
    }
    printf("\"Add Border\" operation is done!\n");
}


/* EOF */
