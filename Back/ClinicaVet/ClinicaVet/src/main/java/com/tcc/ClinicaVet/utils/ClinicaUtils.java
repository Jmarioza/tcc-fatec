package com.tcc.ClinicaVet.utils;

import static org.apache.commons.lang3.StringUtils.leftPad;
import static org.apache.commons.lang3.StringUtils.rightPad;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;


public class ClinicaUtils {

	public static final LocalDate DATE_DEFAULT = LocalDate.parse("0001-01-01");
	private static final DateTimeFormatter TIME_FORMAT_HH_MM_SS = DateTimeFormatter.ofPattern("HHmmss");
	private static final DateTimeFormatter TIME_FORMAT_HH_MM_SS_SS = DateTimeFormatter.ofPattern("HHmmssSS");
	private static final Integer MAX_HOUR_INT_SIZE_8 = 24595999;
	private static final Integer MAX_HOUR_INT_SIZE_6 = 245959;
	private static final DecimalFormat FORMAT_PT_BR = new DecimalFormat("#,###,##0.00");

	private ClinicaUtils() {
		// Construtor vazio
	}

	/**
	 * Retorna valor monetario formatado no padrao da moeda brasileira.
	 * 
	 * @param value valor a ser formatado.
	 * @return valor formatado.
	 */
	public static String formtMoney(BigDecimal value) {
		var newValue = value.setScale(2, RoundingMode.HALF_EVEN);

		return FORMAT_PT_BR.format(newValue);
	}

	/**
	 * Formata valor para o padrao da moeda brasileira.
	 * 
	 * @param value o valor a ser formatado.
	 * @return valor formatado.
	 */
	public static String formtQtde(final BigDecimal value) {
		if (value == null)
			return null;

		return FORMAT_PT_BR.format(value.setScale(3, RoundingMode.DOWN));
	}

	/**
	 * Formata Integer em LocalTime HH:mm:ss.SS
	 * 
	 * @param hora o integer a ser formatado.
	 * @return hora formatada para LocaDateTime (HH:mm:ss.SS)
	 */
	public static LocalTime int8ToTime(Integer hora) {
		if (hora == null || hora.compareTo(MAX_HOUR_INT_SIZE_8) >= 1)
			return LocalTime.MIDNIGHT;
		String sHora = leftPad(hora.toString(), 8, "0");

		return LocalTime.parse(sHora, TIME_FORMAT_HH_MM_SS_SS);
	}

	/**
	 * Formata Integer em LocalTime HH:mm:ss.S
	 * 
	 * @param hora o integer ser formatado.
	 * @return hora formatada para LocaDateTime (HH:mm:ss)
	 */
	public static LocalTime int6ToTime(Integer hora) {
		if (hora == null || hora.compareTo(MAX_HOUR_INT_SIZE_6) >= 1)
			return LocalTime.MIDNIGHT;

		String sHora = leftPad(hora.toString(), 6, "0");

		return LocalTime.parse(sHora, TIME_FORMAT_HH_MM_SS);
	}

	/**
	 * Retorna somente a parte numerica de uma String
	 * 
	 * @param s a string a ser formatada.
	 * @return string sem a parte numerica.
	 */
	public static String numeros(String s) {
		if (s != null)
			return s.replaceAll("\\D+", "");

		return null;
	}

	/**
	 * Formata LocalDateTime para Integer.
	 * 
	 * @param data a data (HH:mm:ss) a ser formatada.
	 * @return int (HHmmss) é a data formatada.
	 */
	public static int getHourSize6(LocalDateTime data) {
		String hora = data.toLocalTime().format(TIME_FORMAT_HH_MM_SS);
		return Integer.parseInt(hora);
	}

	/**
	 * Formata LocalTime para Integer.
	 * 
	 * @param data a data (HH:mm:ss) a ser formatada.
	 * @return int (HHmmss) a data formatada .
	 */
	public static int getHourSize6(LocalTime data) {
		String hora = data.format(TIME_FORMAT_HH_MM_SS);
		return Integer.parseInt(hora);
	}

	/**
	 * Formata LocalDateTime para Integer.
	 * 
	 * @param data a data (HH:mm:ss.SS) a ser formatada.
	 * @return int a data formatada.
	 */
	public static int getHourSize8(LocalDateTime data) {
		String hora = data.toLocalTime().format(TIME_FORMAT_HH_MM_SS_SS);
		return Integer.parseInt(hora);
	}

	/**
	 * Formata LocalTime para Integer.
	 * 
	 * @param data a data (HH:mm:ss.SS) a ser formatada.
	 * @return int a data formatada.
	 */
	public static int getHourSize8(LocalTime data) {
		String hora = data.format(TIME_FORMAT_HH_MM_SS_SS);
		return Integer.parseInt(hora);
	}

	/**
	 * Formata Integer em LocalDate (Data)
	 * 
	 * @param date o inteiro a ser formatado.
	 * @return data formatada (AAAA-MM-DD)
	 */
	public static LocalDate intToDate(Integer date) {
		return LocalDate.parse(date.toString(), DateTimeFormatter.BASIC_ISO_DATE);
	}

	/**
	 * Formata Data para padrao data yyytMMddHHmmssSS
	 * 
	 * @param date a data a ser formatada.
	 * @return data formatada (yyyyMMddHHmmssSSS)
	 */
	public static String dateToFile(LocalDateTime date) {
		return date.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
	}

	/**
	 * Formata LocalDateTime em Integer.
	 * 
	 * @param data a data a ser formatada.
	 * @return data no padrao BASIC_ISO_DATE.
	 */
	public static int dateMultix(LocalDateTime data) {
		String dataMultix = data.format(DateTimeFormatter.BASIC_ISO_DATE);
		return Integer.parseInt(dataMultix);
	}

	/**
	 * Formata LocalDate em Integer.
	 * 
	 * @param data a data a ser formatada.
	 * @return data formatada no padrao BASIC_ISO_DATE.
	 */
	public static int dateMultix(LocalDate data) {
		String dataMultix = data.format(DateTimeFormatter.BASIC_ISO_DATE);
		return Integer.parseInt(dataMultix);
	}

	/**
	 * Formata mascara de um codigo promat.
	 * 
	 * @param sPromat   promat
	 * @param sNumerico numerico
	 * @param sMasca    mascara
	 * @return mascara
	 */
	public static String mascara(final String sPromat, final String sNumerico, final String sMasca) {
		if (Objects.equals(sNumerico.trim(), "S"))
			return promatNumerico(sPromat, sMasca);

		return promatAlfaNumerico(sPromat, sMasca);
	}

	/**
	 * 
	 * @param sPromat promat
	 * @param sMasca  mascara
	 */
	private static String promatNumerico(final String sPromat, final String sMasca) {
		StringBuilder sMascaRes = new StringBuilder(rightPad("", 25));
		int iContaX = 24;
		String sPromatA = leftPad(sPromat, 25, "0");

		for (int iConta = 24; iConta >= 0; iConta--) {
			if (sMasca.charAt(iConta) == 'Z' || sMasca.charAt(iConta) == 'z') {
				if (sPromatA.charAt(iContaX) == '0')
					sMascaRes.setCharAt(iConta, ' ');
				else
					sMascaRes.setCharAt(iConta, sPromatA.charAt(iContaX));
				iContaX--;
			} else if (sMasca.charAt(iConta) == 'B' || sMasca.charAt(iConta) == 'b' || sMasca.charAt(iConta) == ' ')
				sMascaRes.setCharAt(iConta, ' ');
			else if (sMasca.charAt(iConta) == 'x' || sMasca.charAt(iConta) == 'X' || sMasca.charAt(iConta) == '9') {
				sMascaRes.setCharAt(iConta, sPromatA.charAt(iContaX));
				iContaX--;
			} else if (sPromatA.charAt(iContaX) == '0' || sMasca.charAt((iConta - 1)) == '9')
				sMascaRes.setCharAt(iConta, sMasca.charAt(iConta));
		}
		return sMascaRes.toString().trim();
	}

	/**
	 * 
	 * @param sPromat promat.
	 * @param sMasca  mascara.
	 * @return mascara.
	 */
	private static String promatAlfaNumerico(final String sPromat, final String sMasca) {
		StringBuilder sPromatA = new StringBuilder(String.format("%25s", sPromat));

		StringBuilder sMascaRes = new StringBuilder(String.format("%25s", ""));
		int contaX = 1;

		for (int iConta = 0; iConta < 20; iConta++) {
			if (sMasca.charAt(iConta) == 'B' || sMasca.charAt(iConta) == 'b' || sMasca.charAt(iConta) == ' ') {
				sMascaRes.append(' ');

			} else if (sMasca.charAt(iConta) == 'x' || sMasca.charAt(iConta) == 'X' || sMasca.charAt(iConta) == '9') {
				sMascaRes.append(sPromatA.charAt(contaX));
				contaX--;

			} else {
				sMascaRes.append(sMasca.charAt(iConta));
				contaX--;
			}
		}
		return sMascaRes.toString();
	}
}